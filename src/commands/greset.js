import * as utils from '../utils';

export const usage = 'greset';
export const short = 'Remove Google authentication.';
export const description = 'Delete established Google authentication.';
export const aliases = ['googlereset'];
export const examples = [];

export function run(message) {
    if (GUILD_CONFIGS[message.guild.id].GOOGLE_TOKEN) {
        const newConfig = GUILD_CONFIGS[message.guild.id];
        delete newConfig['GOOGLE_TOKEN'];
        utils.guildUpdate(message.guild, newConfig);
        message.channel.send(`:white_check_mark: Google authentication deleted.`);
    } else {
        message.channel.send(`:x: No Google authentication exists.`);
    }
}