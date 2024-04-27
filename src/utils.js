import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import request from 'request';
import moment from 'moment';

import * as constants from './constants';

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch(err) {
    if (err.code !== 'EEXIST') throw err
  }
};

export function guildCreate(guild) {
  const emptyConfig = {
    ...constants.EMPTY_GUILD_CONFIG,
    ID: guild.id,
    NAME: guild.name,
  };
  mkdirSync(path.resolve('./servers'));
  guildUpdate(guild, emptyConfig);
  GUILD_TEMP[guild.id] = { POINTS: {}, STREAMS: {} };
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
          ...constants.EMPTY_GUILD_CONFIG,
          ID: guild.id,
          NAME: guild.name,
        };
        guildUpdate(guild, emptyConfig);
        GUILD_TEMP[guild.id] = { POINTS: {}, STREAMS: {} };
      } else {
        GUILD_CONFIGS[guild.id] = JSON.parse(data);
        checkGuildConfig(guild);
        GUILD_TEMP[guild.id] = { POINTS: {}, STREAMS: {} };

        if (GUILD_CONFIGS[guild.id].GOOGLE_TOKEN) {
          // Guild has setup google auth, recreate the connection.
          if (GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID && GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME) {
            loadSpreadsheet(guild).then(res => GUILD_TEMP[guild.id].POINTS = res);
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

export function stripMentions(message) {
  return message.replace(/ *<[^)]*> */g, ''); // Removes everything inside < >.
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
  return google.sheets({ version: 'v4', auth });
}

export function loadSpreadsheet(guild) {
  return new Promise((resolve, reject) => {
    if (GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID && GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME) {
      createGoogleSheetsClient(guild).spreadsheets.values.get({
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
                pointsFormula: row[2] || '=0',
                points: sheetFormulaTransform(row[2]),
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

export function updateSpreadsheet(guild) {
  return new Promise((resolve, reject) => {
    if (GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID && GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME) {
      createGoogleSheetsClient(guild).spreadsheets.values.update({
        spreadsheetId: GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID,
        valueInputOption: 'USER_ENTERED',
        range: `${GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME}!A2:D`,
        resource: { values: Object.entries(GUILD_TEMP[guild.id].POINTS)
          .map(item => item[1]) // Get value from key value pair.
          .sort((a, b) => b.points - a.points) // Sort points
          .map(item => ([ // Format row.
            item.id,
            item.name,
            item.pointsFormula,
            item.house,
          ]))
        }
      }, err => {
        if (err) {
          reject(err.response && err.response.data && err.response.data.error && err.response.data.error.message
            ? err.response.data.error.message
            : 'Google sheets API error.'
          );
        } else {
          resolve();
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

export function appendFormula(formula, number) {
  let newFormula = formula;
  if (!isNaN(parseInt(formula, 10))) newFormula = `=${formula}`;
  return `${newFormula}+${number}`;
}

export function getUserPointsRow(guild, user) {
  return GUILD_TEMP[guild.id].POINTS[user.id]
  ? GUILD_TEMP[guild.id].POINTS[user.id]
  : {
    id: user.id,
    name: user.username,
    points: 0,
    pointsFormula: '=0',
  };
}

export function checkReboot() {
  try {
    const { channel: channelID, time } = JSON.parse(fs.readFileSync('./reboot.json'));
    CLIENT.channels.get(channelID).send(`Rebooted! (took ${parseFloat((new Date() - time) / 1000).toFixed(2)}s)`);
    fs.unlink('./reboot.json', () => {});
  } catch(_) {
    fs.unlink('./reboot.json', () => {});
  }
}

export function isAdmin(message) {
  if (!GUILD_CONFIGS[message.guild.id].ADMINS.length) return true;
  return GUILD_CONFIGS[message.guild.id].ADMINS.indexOf(message.author.id) !== -1;
}

export function checkGuildConfig(guild) {
  let changed = false;
  Object.keys(constants.EMPTY_GUILD_CONFIG).forEach(prop => {
    if (typeof GUILD_CONFIGS[guild.id][prop] === 'undefined') {
      changed = true;
      GUILD_CONFIGS[guild.id][prop] = constants.EMPTY_GUILD_CONFIG[prop];
    }
  });

  if (changed) {
    guildUpdate(guild, GUILD_CONFIGS[guild.id]);
  }
}
