import commands from '../commands';
import * as utils from '../utils';

export const usage = 'help <command>';
export const short = 'Command list and help.';
export const description = `List the total list of commands or get specifics on a single command.`;
export const aliases = ['h'];
export const examples = ['help', 'help prefix'];
export const group = 'utlity';

export function run(message) {
    const prefix = utils.getPrefix(message);

    const msg = utils.stripCommand(message).toLowerCase();
    if (msg) {
        let cmd = commands[msg];
        if (cmd) {
            message.channel.send(
                `\`${prefix}${cmd.usage}\`: ${cmd.description}\n` +
                (cmd.aliases && cmd.aliases.length > 0 ? `**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(', ')}\n` : '') +
                (cmd.examples && cmd.examples.length > 0 ? `**Examples**: ${cmd.examples.map(e => `\`${prefix}${e}\``).join(', ')}\n` : '')
            );
        } else {
            message.channel.send(`No such command. Try \`${prefix}help\` for a list of all commands.`);
        }
    } else {
        let msg = ':mega: **Commands**\n';
        const groups = {};
        Object.keys(commands).forEach(command => {
            if (!commands[command].alias) {
                if (!groups[commands[command].group]) {
                    groups[commands[command].group] = {};
                }
                groups[commands[command].group][command] = commands[command];
            }
        });

        Object.keys(groups).forEach(group => {
            msg += `**${group}**:\n`;
            Object.keys(groups[group]).forEach(command => {
                msg += `\`${prefix}${command}\`: ${commands[command].short}\n`;
            });
        });

        message.channel.send(msg);
    }
}
