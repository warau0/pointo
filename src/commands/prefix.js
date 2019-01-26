import * as utils from '../utils';

export const usage = 'prefix <prefix>';
export const short = 'Check and set command prefix.';
export const description = `Check the current command prefix or change it to something else.`;
export const aliases = [];
export const examples = ['prefix', 'prefix -'];

export function run(message) {
    const msg = utils.stripCommand(message);
    if (msg) {
        utils.guildUpdate(message.guild, {
            ...GUILD_CONFIGS[message.guild.id],
            PREFIX: msg
        });
        message.channel.send(utils.formatResponse('pos', '', `Command prefix changed to \`${msg}\`.`));
    } else {
        const prefix = utils.getPrefix(message);
        message.channel.send(`Current command prefix: \`${prefix}\`.`);
    }
}
