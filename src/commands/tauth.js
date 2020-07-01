import request from 'request';
import moment from 'moment';
import * as utils from '../utils';

export const usage = 'tauth <code>';
export const short = 'Authenticate with Twitch.';
export const description = 'Authenticate a Twitch account with the bot. Required before using Stream notifications.';
export const aliases = ['twitchauth'];
export const examples = ['tauth', 'gauth 3cylyt2w...'];
export const group = 'settings';

export function run(message) {
    if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

    if (!CONFIG.TWITCH_CLIENT_ID || !CONFIG.TWITCH_CLIENT_SECRET) {
      message.channel.send(utils.formatResponse('neg', 'No client', 'Bot owner has not set up Twitch OAuth2 authentication.'));
      return;
    }

    const msg = utils.stripCommand(message);

    if (GUILD_CONFIGS[message.guild.id].TWITCH_TOKEN) {
      message.channel.send(utils.formatResponse(
        'neg', 'Already authenticated',
        `Please run \`${utils.getPrefix(message)}treset\` if you wish to reauthenticate.`
      ));
      return;
    }

    if (msg) {
        request({
            method: 'POST',
            uri: `https://id.twitch.tv/oauth2/token`
            + `?client_id=${CONFIG.TWITCH_CLIENT_ID}&client_secret=${CONFIG.TWITCH_CLIENT_SECRET}`
            + `&code=${msg}`
            + `&grant_type=authorization_code`
            + `&redirect_uri=${CONFIG.HOST_URI}:${CONFIG.HOST_PORT}/twitch/auth_callback`,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }, (err, res) => {
            if (err) {
                message.channel.send(utils.formatResponse('neg', 'Failed authenticating', 'Please check your code.'));
            } else {
              const body = JSON.parse(res.body);

              if (body && body.status !== 200 && body.message) {
                message.channel.send(utils.formatResponse('neg', 'Failed authenticating', body.message));
              } else {
                const expiry_date = +moment()
                  .add(res.body.expires_in, 'seconds') // Point of expiry
                  .add(5, 'seconds'); // Some leeway

                utils.guildUpdate(message.guild, {
                    ...GUILD_CONFIGS[message.guild.id],
                    TWITCH_TOKEN: { ...body, expiry_date },
                });
                message.channel.send(utils.formatResponse('pos', '', 'Authentication successful!'));
              }
            }
          });
    } else {
        const authUrl = 'https://id.twitch.tv/oauth2/authorize'
        + `?client_id=${CONFIG.TWITCH_CLIENT_ID}`
        + `&redirect_uri=${CONFIG.HOST_URI}:${CONFIG.HOST_PORT}/twitch/auth_callback`
        + `&response_type=code`
        + `&state=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;

        message.channel.send(`Get Twitch authorization code here: __${authUrl}__\n` +
            `Enter code as follows: \`${utils.getPrefix(message)}tauth <code>\``);
    }
}
