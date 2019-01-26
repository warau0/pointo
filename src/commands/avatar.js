import * as utils from '../utils';

export const usage = 'avatar <user>';
export const short = 'Get avatar link.';
export const description = `Get the image used as either your own or someone else's avatar.`;
export const aliases = [];
export const examples = ['avatar', 'avatar @warau'];

export function run(message) {
    const msg = utils.stripCommand(message);
    if (msg) {
        const member = message.mentions.members.first() || message.guild.members.get(msg);
        if (member) {
            message.channel.send(member.user.avatarURL
                ? `${member.user.username}'s avatar: ${member.user.avatarURL}`
                : `This user doesn't seem to have an avatar.`);
        } else {
            message.channel.send(`I'm afraid I couldn't find \`${msg}\`. Please use their tag.`);
        }
    } else {
        message.channel.send(message.author.avatarURL
            ? `${message.author.username}'s avatar: __${message.author.avatarURL}__`
            : `You don't seem to have an avatar set.`);
    }
}
