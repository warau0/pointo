import * as utils from '../utils';

export const usage = 'pointsgive <user> <number>';
export const short = 'Give someone some points.';
export const description = `Give another user some points.`;
export const aliases = ['give'];
export const examples = ['pointsgive @warau 5'];
export const group = 'points';

export function run(message) {
    const msg = utils.stripCommand(message);
    const msgSplit = msg.split(' ');

    if (msgSplit.length !== 2) {
        return message.channel.send(utils.formatResponse('neg', 'Invalid input',
        `Please check your command. Refer to \`${utils.getPrefix(message)}help\` for the correct syntax.`));
    }

    if (!message.mentions.members.first()) {
        return message.channel.send(utils.formatResponse('neg', 'Invalid user',
        `Could not find the user \`${msgSplit[0]}\`. Please use their tag.`));
    }

    const user = message.mentions.members.first().user;
    const userRow = utils.getUserPointsRow(message.guild, user);
    const number = parseInt(msgSplit[1], 10);
    if (isNaN(number)) {
        return message.channel.send(utils.formatResponse('neg', 'Failed', `\`${msg}\` isn't a number!`));
    }

    userRow.name = user.username;
    userRow.pointsFormula = utils.appendFormula(userRow.pointsFormula, number);
    userRow.points = userRow.points + number;

    GUILD_TEMP[message.guild.id].POINTS[user.id] = userRow;
    utils.updateSpreadsheet(message.guild)
    .then(() => message.channel.send(utils.formatResponse('pos', '',
        `${user.username}: **+${number}**! Total: **${userRow.points}**`)))
    .catch(err =>  message.channel.send(utils.formatResponse('neg', 'Failed saving', err)));
}
