import * as utils from '../utils';

export const usage = 'greset';
export const short = 'Remove Google authentication.';
export const description = 'Delete established Google authentication.';
export const aliases = ['googlereset'];
export const examples = [];
export const group = 'settings';

export function run(message) {
    if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

    if (GUILD_CONFIGS[message.guild.id].GOOGLE_TOKEN) {
        const newConfig = GUILD_CONFIGS[message.guild.id];
        delete newConfig['GOOGLE_TOKEN'];
        utils.guildUpdate(message.guild, newConfig);
        message.channel.send(utils.formatResponse('pos', '', 'Google authentication deleted.'));
    } else {
        message.channel.send(utils.formatResponse('neg', '', 'No Google authentication exists.'));
    }
}