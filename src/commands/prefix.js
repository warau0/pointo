import * as constants from '../constants';
import * as utils from '../utils';

export default function (message) {
    const msg = utils.stripCommand(message);
    if (msg) {
        utils.guildUpdate(message.guild, {
            ...GUILD_CONFIGS[message.guild.id],
            PREFIX: msg
        });
        message.channel.send(`Command prefix changed to \`${msg}\`.`);
    } else {
        const guildConfig = GUILD_CONFIGS[message.guild.id];
        const prefix = guildConfig ? guildConfig.PREFIX : constants.DEFAULT_PREFIX;

        message.channel.send(`Current command prefix: \`${prefix}\`.`);
    }
}
