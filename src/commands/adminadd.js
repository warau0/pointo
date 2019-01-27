import * as utils from '../utils';

export const usage = 'adminadd <user>';
export const short = 'Add a bot admin.';
export const description = 'Give a user access to admin commands.';
export const aliases = ['admin'];
export const examples = ['adminadd @warau'];
export const group = 'settings';

export function run(message) {
    if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

    let member = message.mentions.members.first();

    if (!member) {
        return message.channel.send(utils.formatResponse('neg', 'No user',
        'Please tag the user to add.'));
    }

    if (GUILD_CONFIGS[message.guild.id].ADMINS.indexOf(member.id) !== -1) {
        return message.channel.send(utils.formatResponse('neg', '',
        `${member.user.username} is already an admin.`));
    }

    utils.guildUpdate(message.guild, {
        ...GUILD_CONFIGS[message.guild.id],
        ADMINS: [...GUILD_CONFIGS[message.guild.id].ADMINS, member.id],
    });
    message.channel.send(utils.formatResponse('pos', '', `${member.user.username} added to list of admins!`));
}
