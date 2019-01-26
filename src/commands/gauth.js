import { google } from 'googleapis';

import * as utils from '../utils';

export const usage = 'gauth <code>';
export const short = 'Authenticate with Google.';
export const description = 'Authenticate a Google accounnt with the bot. Required before using a google Sheet.';
export const aliases = ['googleauth'];
export const examples = ['gauth', 'gauth 3/4gBP2D8QhvcESmz...'];

export function run(message) {
    if (!CONFIG.GOOGLE_CLIENT_ID ||
        !CONFIG.GOOGLE_CLIENT_SECRET ||
        !CONFIG.GOOGLE_PROJECT_ID) {
            message.channel.send(':x: Bot owner has not set up an OAuth2 client.');
            return;
        }

    const msg = utils.stripCommand(message);
    if (msg) {
        if (!!GUILD_TEMP[message.guild.id].GOOGLE_CLIENT) {
            if (GUILD_CONFIGS[message.guild.id].GOOGLE_TOKEN) {
                message.channel.send(`:x: **Already authenticated**: Please run \`${utils.getPrefix(message)}greset\` if you wish to reauthenticate.`)
            } else {
                GUILD_TEMP[message.guild.id].GOOGLE_CLIENT.getToken(msg, (err, token) => {
                    if (err) {
                        message.channel.send(`:x: **Failed authenticating**: please check your code.`);
                    } else {
                        utils.guildUpdate(message.guild, {
                            ...GUILD_CONFIGS[message.guild.id],
                            GOOGLE_TOKEN: token,
                        });
                        GUILD_TEMP[message.guild.id].GOOGLE_CLIENT.setCredentials(token);
                        GUILD_TEMP[message.guild.id].GOOGLE_SHEETS = google.sheets({ version: 'v4', auth: GUILD_TEMP[message.guild.id].GOOGLE_CLIENT });
                        message.channel.send(':white_check_mark: Auth successful!\n');
                    }
                });
            }
        } else {
            message.channel.send(`:x: No auth client exists, please run \`${utils.getPrefix(message)}gauth\``);
        }
    } else {
        GUILD_TEMP[message.guild.id].GOOGLE_CLIENT = new google.auth.OAuth2(
            CONFIG.GOOGLE_CLIENT_ID, CONFIG.GOOGLE_CLIENT_SECRET, 'urn:ietf:wg:oauth:2.0:oob',
          );

          const authUrl = GUILD_TEMP[message.guild.id].GOOGLE_CLIENT.generateAuthUrl({
            access_type: 'offline', scope: ['https://www.googleapis.com/auth/spreadsheets'],
          });

          message.channel.send(`Get Google authorization code here: __${authUrl}__\n` +
            `Enter code as follows: \`${utils.getPrefix(message)}gauth <code>\``);
    }
}