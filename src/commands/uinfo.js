import Discord from 'discord.js';

import * as utils from '../utils';

export const usage = 'uinfo <user>';
export const short = 'Info about a user.';
export const description = `Get some general info about a user or yourself.`;
export const aliases = ['user', 'avatar'];
export const examples = ['uinfo', 'uinfo @warau'];
export const group = 'utlity';

export function run(message) {
    const msg = utils.stripCommand(message);
    let member = msg ? message.mentions.members.first()
        : message.guild.members.find(member => member.user.id === message.author.id);

    message.channel.send({ embed: new Discord.RichEmbed()
        .setColor('#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16)))
        .setThumbnail(member.user.avatarURL ? member.user.avatarURL : null)
        .setAuthor(`${member.user.tag} (${member.id})`, (member.user.avatarURL ? member.user.avatarURL : null))
        .addField('Nickname:', (member.nickname ? member.nickname : 'No nickname'), true)
        .addField('Playing', `${member.user.presence.game ? `${member.user.presence.game.name}` : 'not playing anything.'}`, true)
        .addField('Bot', `${member.user.bot ? 'Yes' : 'No'}`, true)
        .addField('Roles', `${member.roles.filter(r => r.id !== message.guild.id).map(r => `\`${r.name}\``).join(' **|** ') || 'No Roles'}`, true)
        .addField('Joined server', `${member.joinedAt.toDateString()}`, true)
        .addField('Joined Discord', `${member.user.createdAt.toDateString()}`, true)
     });
}
