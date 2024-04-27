import * as utils from '../utils';

export const usage = 'gauth <code>';
export const short = 'Authenticate with Google.';
export const description = 'Authenticate a Google accounnt with the bot. Required before using a google Sheet.';
export const aliases = ['googleauth'];
export const examples = ['gauth', 'gauth 3/4gBP2D8QhvcESmz...'];
export const group = 'settings';

export function run(message) {
    if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

    if (!CONFIG.GOOGLE_CLIENT_ID ||
      !CONFIG.GOOGLE_CLIENT_SECRET ||
      !CONFIG.GOOGLE_PROJECT_ID) {
      message.channel.send(utils.formatResponse('neg', 'No client', 'Bot owner has not set up Google OAuth2 authentication.'));
      return;
    }

    const msg = utils.stripCommand(message);

    if (GUILD_CONFIGS[message.guild.id].GOOGLE_TOKEN) {
      message.channel.send(utils.formatResponse(
        'neg', 'Already authenticated',
        `Please run \`${utils.getPrefix(message)}greset\` if you wish to reauthenticate.`
      ));
      return;
    }

    if (msg) {
        GOOGLE_AUTH.getToken(msg, (err, token) => {
            if (err) {
                message.channel.send(utils.formatResponse('neg', 'Failed authenticating', 'Please check your code.'));
            } else {
                utils.guildUpdate(message.guild, {
                    ...GUILD_CONFIGS[message.guild.id],
                    GOOGLE_TOKEN: token,
                });
                message.channel.send(utils.formatResponse('pos', '', 'Authentication successful!'));
            }
        });
    } else {
        const authUrl = GOOGLE_AUTH.generateAuthUrl({
            access_type: 'offline', scope: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        message.channel.send(`Get Google authorization code here: __${authUrl}__\n` +
            `Enter code as follows: \`${utils.getPrefix(message)}gauth <code>\``);
    }
}