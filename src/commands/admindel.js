import * as utils from '../utils';

export const usage = 'admindel <user>';
export const short = 'Remove a bot admin.';
export const description = 'Remove a user\'s access to admin commands.';
export const aliases = ['deadmin'];
export const examples = ['admindel @warau'];
export const group = 'settings';

export function run(message) {
    if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

    let member = message.mentions.members.first();

    if (!member) {
        return message.channel.send(utils.formatResponse('neg', 'No user',
        'Please tag the user to remove.'));
    }

    if (GUILD_CONFIGS[message.guild.id].ADMINS.indexOf(member.id) === -1) {
        return message.channel.send(utils.formatResponse('neg', '',
        `${member.user.username} isn't an admin.`));
    }

    utils.guildUpdate(message.guild, {
        ...GUILD_CONFIGS[message.guild.id],
        ADMINS: GUILD_CONFIGS[message.guild.id].ADMINS.filter(i => i !== member.id),
    });
    message.channel.send(utils.formatResponse('pos', '', `${member.user.username} removed from list of admins!`));
}
