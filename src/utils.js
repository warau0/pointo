import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

import * as constants from './constants';

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

export function guildCreate(guild) {
  const emptyConfig = {
    id: guild.id,
    name: guild.name,
    prefix: null,
  };
  mkdirSync(path.resolve('./servers'));
  guildUpdate(guild, emptyConfig);
}

export function guildDelete(guild) {
  fs.unlinkSync(path.resolve(`./servers/${guild.id}.json`));
  delete GUILD_CONFIGS[guild.id];
}

export function loadGuildConfigs(guilds) {
  mkdirSync(path.resolve('./servers'));

  guilds.forEach(guild => {
    fs.readFile(path.resolve(`./servers/${guild.id}.json`), (err, data) => {
      if (err) {
        // Joined a guild while offline.
        const emptyConfig = {
          ID: guild.id,
          NAME: guild.name,
          PREFIX: null,
        };
        guildUpdate(guild, emptyConfig);
        GUILD_TEMP[guild.id] = {};
      } else {
        GUILD_CONFIGS[guild.id] = JSON.parse(data);
        GUILD_TEMP[guild.id] = {};

        if (GUILD_CONFIGS[guild.id].GOOGLE_TOKEN) {
          // Guild has setup google auth, recreate the connection.
          createGoogleSheetsClient(guild);

          if (GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID && GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME) {
            loadSpreadsheet(guild).then(res => GUILD_TEMP[guild.id].SCORES = res);
          }
        }
      }
    });
  });
}

export function guildUpdate(guild, config) {
  fs.writeFile(path.resolve(`./servers/${guild.id}.json`), JSON.stringify(config), () => {});
  GUILD_CONFIGS[guild.id] = config;
}

export function stripCommand(message) {
  if (message && message.content) {
    return message.content.split(' ').slice(1).join(' ');
  } else {
    return '';
  }
}

export function getPrefix(message) {
  const guildConfig = GUILD_CONFIGS[message.guild.id];
  return guildConfig && guildConfig.PREFIX ? guildConfig.PREFIX.toLowerCase() : constants.DEFAULT_PREFIX;
}

export function extractAliases(commands) {
  const all = {};

  Object.keys(commands).forEach((command) => {
    all[command] = commands[command];
    commands[command].aliases.forEach(alias => {
      all[alias] = { ...commands[command], alias: true };
    });
  });

  return all;
}

export function encodedStringArray(array) {
  return array.map(i => `\`${i}\``).join(', ');
}

export function formatResponse(icon, title = '', text = '') {
  const icons = { pos: ':white_check_mark:', neg: ':x:' };
  return `${icons[icon] ? icons[icon] : ''} ${title ? `**${title}**` : ''}${title && text ? ': ' : ''}${text}`;
}

export function createGoogleSheetsClient(guild) {
  const auth = new google.auth.OAuth2(
    CONFIG.GOOGLE_CLIENT_ID, CONFIG.GOOGLE_CLIENT_SECRET, 'urn:ietf:wg:oauth:2.0:oob',
  );
  auth.setCredentials(GUILD_CONFIGS[guild.id].GOOGLE_TOKEN);

  GUILD_TEMP[guild.id].GOOGLE_SHEETS = google.sheets({ version: 'v4', auth });
}

export function loadSpreadsheet(guild) {
  return new Promise((resolve, reject) => {
    if (GUILD_TEMP[guild.id].GOOGLE_SHEETS
      && GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID
      && GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME) {
      GUILD_TEMP[guild.id].GOOGLE_SHEETS.spreadsheets.values.get({
        spreadsheetId: GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID,
        range: `${GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME}!A2:D`,
        valueRenderOption: 'FORMULA',
      }, (err, res) => {
        if (err) {
          reject(err.response && err.response.data && err.response.data.error && err.response.data.error.message
            ? err.response.data.error.message
            : 'Google sheets API error.'
          );
        } else {
          const rows = res.data.values;
          if (rows && rows.length) {
            resolve(
              rows.map(row => ({
                id: row[0],
                name: row[1],
                scoreFormula: row[2] || '=0',
                score: sheetFormulaTransform(row[2]),
                house: row[3] || '',
              })).reduce((map, user) => {
                map[user.id] = { ...user };
                return map;
              }, {})
            );
          } else {
            resolve({}); // Empty sheet.
          }
        }
      });
    } else {
      reject('Missing Google sheet variables.');
    }
  });
}

export function sheetFormulaTransform(formula) {
  if (!formula) return 0;
  if (!isNaN(parseInt(formula, 10))) return formula; // Not a formula.

  return formula
    .substring(1) // Remove '='.
    .split('+') // Can only read formulas using nothing but plus.
    .reduce((add, num) => (add + parseInt(num, 10)), 0); // Sum formula
}
