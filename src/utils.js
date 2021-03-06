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

        /* if (GUILD_CONFIGS[guild.id].TWITCH_STREAMS.length && GUILD_CONFIGS[guild.id].TWITCH_TOKEN) {
          // Guild has set up twitch stream watchers.
          twitchRequest(guild.id, null, () => createWebHooks(guild.id, GUILD_CONFIGS[guild.id].TWITCH_STREAMS));
        } */
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

/*
export function twitchStatusChange(streamerID, body) {
  if (body.data.length > 0) {
    Object.values(GUILD_CONFIGS).forEach(guild => {
      if(guild.TWITCH_STREAMS.length) {
        guild.TWITCH_STREAMS.forEach(streamer => {
          const [user, id] = streamer.split('::');
          if (id === streamerID) {
            announceStream(guild.ID, user);
          }
        });
      }
    });
  } else {
    Object.values(GUILD_CONFIGS).forEach(guild => {
      if(guild.TWITCH_STREAMS.length) {
        guild.TWITCH_STREAMS.forEach(streamer => {
          const [user, id] = streamer.split('::');
          if (id === streamerID) {
            denounceStream(guild.ID, user);
          }
        });
      }
    });
  }
}

export function announceStream(guildID, name) {
  if (GUILD_CONFIGS[guildID].STREAM_CHANNEL) {
    if (!GUILD_TEMP[guildID].STREAMS[name]) { // Only announce if haven't already. Blocks any potential duplicate announcements
      CLIENT.channels.get(GUILD_CONFIGS[guildID].STREAM_CHANNEL)
        .send(`:tv: ${GUILD_CONFIGS[guildID].STREAM_ROLE ? GUILD_CONFIGS[guildID].STREAM_ROLE + ' ' : ''}${name} is now live! https://www.twitch.tv/${name}`)
        .then((msg) => {
          GUILD_TEMP[guildID].STREAMS[name] = msg;
        });
    }
  }
}

export function denounceStream(guildID, name) {
  if (GUILD_CONFIGS[guildID].STREAM_CHANNEL) {
    if (GUILD_TEMP[guildID].STREAMS[name]) {
      GUILD_TEMP[guildID].STREAMS[name]
        .edit(`:zzz: ${name} has gone offline. https://www.twitch.tv/${name}`);
      delete GUILD_TEMP[guildID].STREAMS[name];
    }
  }
}

export function twitchRequest(guildId, requestData, callback) {
  const token = GUILD_CONFIGS[guildId].TWITCH_TOKEN;
  const expiryInFuture = moment(token.expiry_date).isAfter();
  if (expiryInFuture) {
    if (requestData) {
      return request(requestData, callback);
    } else {
      callback();
    }
  } else {
    console.log('Refreshing twitch token');
    request({
      method: 'POST',
      uri: `https://id.twitch.tv/oauth2/token`
      + `?client_id=${CONFIG.TWITCH_CLIENT_ID}&client_secret=${CONFIG.TWITCH_CLIENT_SECRET}`
      + `&grant_type=refresh_token`
      + `&refresh_token=${token.refresh_token}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }, (err, res) => {
      if (err) {
          callback(err);
      } else {
          const body = JSON.parse(res.body);

          if (body && body.status !== 200 && body.message) {
            return callback(null, null, JSON.stringify(body));
          } else {
            const expiry_date = +moment().add(body.expires_in, 'seconds').add(5, 'seconds');

            guildUpdate({ id: guildId }, {
                ...GUILD_CONFIGS[guildId],
                TWITCH_TOKEN: { ...body, expiry_date },
            });
    
            if (requestData) {
              const newRequestData = {
                ...requestData,
                headers: { ...requestData.headers, Authorization: `Bearer ${body.access_token}` },
              };
              return request(newRequestData, callback);
            } else {
              callback();
            }
          }
      }
    });
  }
}

export function createWebHook(guildId, id, user) {
  twitchRequest(guildId, {
    method: 'POST',
    uri: `https://api.twitch.tv/helix/webhooks/hub`,
    headers: {
      'Client-ID': CONFIG.TWITCH_CLIENT_ID,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GUILD_CONFIGS[guildId].TWITCH_TOKEN.access_token}`,
    },
    json: {
      'hub.mode': 'subscribe',
      'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${id}`,
      'hub.callback': `${CONFIG.HOST_URI}:${CONFIG.HOST_PORT}/twitch/sub/${id}`,
      'hub.lease_seconds': (86400 * 10), // 10 days (max)
    },
    // TODO Send hub.secret
    // TODO Create a timeout refreshing webhook if bot is still up when lease expires.
  }, (err, res) => {
    if (err) { return console.log('Failed creating webhook', err); }
    if (res && res.statusCode === 202) {
      console.log(`Created webhook: ${user} (${id})`);
    } else {
      console.error(res);
    }
  });
}

export function destroyWebHook(guildId, id, user) {
  return new Promise((resolve, reject) => {
    twitchRequest(guildId, {
      method: 'POST',
      uri: `https://api.twitch.tv/helix/webhooks/hub`,
      headers: {
        'Client-ID': CONFIG.TWITCH_CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GUILD_CONFIGS[guildId].TWITCH_TOKEN.access_token}`,
      },
      json: {
        'hub.mode': 'unsubscribe',
        'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${id}`,
        'hub.callback': `${CONFIG.HOST_URI}:${CONFIG.HOST_PORT}/twitch/unsub/${id}`,
      },
    }, (err, res) => {
      if (res && res.statusCode === 202) {
        console.log(`Destroyed webhook: ${user} (${id})`);
        resolve();
      } else {
        if (err) {
          console.log('Failed destroying webhook', err);
        } else {
          console.log('Failed destroying webhook.');
        }
        reject();
      }
    });
  })
}

export function createWebHooks(guildId, streamers) {
  const promises = [];
  streamers.forEach(streamer => {
    const [user, id] = streamer.split('::');
    promises.push(createWebHook(guildId, id, user));
  });
  return promises;
}

export function destroyWebHooks() {
  const promises = [];
  Object.values(GUILD_CONFIGS).forEach(guild => {
    if (guild.TWITCH_STREAMS.length && guild.TWITCH_TOKEN) {
      guild.TWITCH_STREAMS.forEach(streamer => {
        const [user, id] = streamer.split('::');
        promises.push(destroyWebHook(guild.ID, id, user));
      });
    }
  });
  return promises;
}
*/
