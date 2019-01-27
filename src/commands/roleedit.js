import * as utils from '../utils';

export const usage = 'roleedit <role>';
export const short = 'List / Add / remove self-assignable roles.';
export const description = 'Add or remove a role from the list of self-assignable roles. Emit role to get a list of all self-assignable roles.\nName must be an extact case-insensitive match.';
export const aliases = ['roles', 'selfroles', 'editrole'];
export const examples = ['roleedit', 'roleedit Big guy'];
export const group = 'settings';

export function run(message) {
    const msg = utils.stripCommand(message);

    if (!msg) {
        if (!GUILD_CONFIGS[message.guild.id].SELF_ROLES.length) {
            return message.channel.send(utils.formatResponse('neg', '', 'there are no self-assignable roles.'));
        } else {
            return message.channel.send(`:pushpin: **Self-assignable roles:**\n${GUILD_CONFIGS[message.guild.id]
                .SELF_ROLES.map(role => `\`${role}\``).join(' **|** ')}`);
        }
    }

    if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

    const role = message.guild.roles.find(role => role.name.toLowerCase() === msg.toLowerCase());

    if (!role) {
        return message.channel.send(utils.formatResponse('neg', '', `Found no role named \`${msg}\`.`));
    }

    if (GUILD_CONFIGS[message.guild.id].SELF_ROLES.indexOf(role.name) !== -1) {
        utils.guildUpdate(message.guild, {
            ...GUILD_CONFIGS[message.guild.id],
            SELF_ROLES: GUILD_CONFIGS[message.guild.id].SELF_ROLES.filter(i => i.toLowerCase() !== role.name.toLowerCase()),
        });
        message.channel.send(utils.formatResponse('pos', '', `\`${role.name}\` is no longer a self-assignable role.`));
    } else {
        if (role.position >= message.guild.me.highestRole.position) {
            return message.channel.send(utils.formatResponse('neg', '',
                `The \`${role.name}\` role is higher than my own so I can\'t assign it.`));
        }

        utils.guildUpdate(message.guild, {
            ...GUILD_CONFIGS[message.guild.id],
            SELF_ROLES: [...GUILD_CONFIGS[message.guild.id].SELF_ROLES, role.name]
        });
        message.channel.send(utils.formatResponse('pos', '', `\`${role.name}\` added to self-assignable roles.`));
    }
}
