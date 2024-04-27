import Discord from 'discord.js';

import * as utils from '../utils';

export const usage = 'roleassign <role>';
export const short = 'Give / Remove a self-assignable role on yourself';
export const description = `Give / Remove a self-assignable role on yourself.\nName must be an extact case-insensitive match.`;
export const aliases = ['role', 'assignrole'];
export const examples = ['roleassign Big guy'];
export const group = 'utlity';

export async function run(message) {
    const msg = utils.stripCommand(message);

    const role = message.guild.roles.find(role => role.name.toLowerCase() === msg.toLowerCase());

    if (!role) {
        return message.channel.send(utils.formatResponse('neg', '', `Found no role named \`${msg}\`.`));
    }

    if (GUILD_CONFIGS[message.guild.id].SELF_ROLES.indexOf(role.name) === -1) {
        return message.channel.send(utils.formatResponse('neg', '', `The \`${role.name}\` role isn't self-assignable.`));
    }
    try {
        const member = message.guild.members.find(member => member.user.id === message.author.id);

        if (member.roles.get(role.id)) {
            await member.removeRole(role.id);
            message.channel.send(utils.formatResponse('pos', '', `You no longer have the \`${role.name}\` role **${message.author.username}**.`));
        } else {
            await member.addRole(role.id);
            message.channel.send(utils.formatResponse('pos', '', `You now have the \`${role.name}\` role **${message.author.username}**.`));
        }
    } catch(err) {
        let response = '';
        switch (err.message) {
            case 'Missing Access':
                response = `Missing \`Manage roles\` server permission.`;
                break;
            case 'Missing Permissions':
                response = `The \`${role.name}\` role is higher than my own so I can\'t assign it.`;
                break;
            default: response = '**Unknown error:** ' + JSON.stringify(err);
        }
        message.channel.send(utils.formatResponse('neg', '', response));
    }
}
