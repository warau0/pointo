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
                ? utils.formatResponse('', `${member.user.username}'s avatar`, member.user.avatarURL)
                : utils.formatResponse('neg', `This user has no avatar.`)
            );
        } else {
            message.channel.send(utils.formatResponse('neg', '', `Couldn't find anyone named \`${msg}\`. Please use their tag.`));
        }
    } else {
        message.channel.send(message.author.avatarURL
            ? utils.formatResponse('', `${message.author.username}'s avatar`, `__${message.author.avatarURL}__`)
            : utils.formatResponse('neg', `You have no avatar.`)
        );
    }
}
