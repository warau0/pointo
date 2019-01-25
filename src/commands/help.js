import commands from '../commands';
import * as constants from '../constants';
import * as utils from '../utils';

export default function (message) {
    const guildConfig = GUILD_CONFIGS[message.guild.id];
    const prefix = guildConfig ? guildConfig.PREFIX : constants.DEFAULT_PREFIX;

    const msg = utils.stripCommand(message);
    if (msg) {
        let cmd = commands[msg];
        if (cmd) {
            message.channel.send(
                `\`${prefix}${msg}\`: ${cmd.description}\n` +
                (cmd.aliases && cmd.aliases.length > 0 ? `Aliases: ${cmd.aliases.map(a => `\`${a}\``).join(', ')}\n` : '') +
                (cmd.examples && cmd.examples.length > 0 ? `Examples: ${cmd.examples.map(e => `\`${prefix}${e}\``).join(', ')}\n` : '')
            );
        } else {
            message.channel.send(`No such command. Try \`${prefix}help\` for a list of all commands.`);
        }
    } else {
        let msg = ':mega: **Commands**\n';
        Object.keys(commands).forEach(command => {
            if (!commands[command].alias)
                msg += `\`${prefix}${command}\`: ${commands[command].short}\n`;
        });

        message.channel.send(msg);
    }
}
