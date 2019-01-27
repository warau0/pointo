import * as utils from '../utils';

export const usage = 'admin <user>';
export const short = 'List / Add / remove bot admins.';
export const description = 'Give or remove a user\'s access to admin commands. Emit user to get a list of all admins.';
export const aliases = ['admins'];
export const examples = ['admin', 'admin @warau'];
export const group = 'settings';

export function run(message) {
    let member = message.mentions.members.first();

    if (!member) {
        if (GUILD_CONFIGS[message.guild.id].ADMINS.length) {
            return message.channel.send(`:triangular_flag_on_post: **Admins:**\n${GUILD_CONFIGS[message.guild.id].ADMINS.map(member =>
                `\`${message.guild.members.get(member).user.username}\``).join(' **|** ')}`);
        }
        return message.channel.send(utils.formatResponse('neg', '', 'There are no admins.'));
    }

    if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

    if (GUILD_CONFIGS[message.guild.id].ADMINS.indexOf(member.id) !== -1) {
        utils.guildUpdate(message.guild, {
            ...GUILD_CONFIGS[message.guild.id],
            ADMINS: GUILD_CONFIGS[message.guild.id].ADMINS.filter(i => i !== member.id),
        });
        message.channel.send(utils.formatResponse('pos', '', `**${member.user.username}** is no longer an admin.`));
    } else {
        utils.guildUpdate(message.guild, {
            ...GUILD_CONFIGS[message.guild.id],
            ADMINS: [...GUILD_CONFIGS[message.guild.id].ADMINS, member.id],
        });
        message.channel.send(utils.formatResponse('pos', '', `**${member.user.username}** added to admins.`));
    }
}
