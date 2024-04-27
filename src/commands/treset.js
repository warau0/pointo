import * as utils from '../utils';

export const usage = 'treset';
export const short = 'Remove Twitch authentication.';
export const description = 'Delete established Twitch authentication.';
export const aliases = ['twitchreset'];
export const examples = [];
export const group = 'settings';

export function run(message) {
    if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

    if (GUILD_CONFIGS[message.guild.id].TWITCH_TOKEN) {
        const newConfig = GUILD_CONFIGS[message.guild.id];
        delete newConfig['TWITCH_TOKEN'];
        utils.guildUpdate(message.guild, newConfig);
        message.channel.send(utils.formatResponse('pos', '', 'Twitch authentication deleted.'));
    } else {
        message.channel.send(utils.formatResponse('neg', '', 'No Twitch authentication exists.'));
    }
}