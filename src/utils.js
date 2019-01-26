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

export function createGoogleSheetsClient(guild) {
  const auth = new google.auth.OAuth2(
    CONFIG.GOOGLE_CLIENT_ID, CONFIG.GOOGLE_CLIENT_SECRET, 'urn:ietf:wg:oauth:2.0:oob',
  );
  auth.setCredentials(GUILD_CONFIGS[guild.id].GOOGLE_TOKEN);

  GUILD_TEMP[guild.id].GOOGLE_SHEETS = google.sheets({ version: 'v4', auth });
}