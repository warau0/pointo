import * as utils from '../utils';

export const usage = 'pointssub <number>';
export const short = 'Remove or view points.';
export const description = `Remove some of your own points or check how many you have.`;
export const aliases = ['sub', 'minus', 'subtract'];
export const examples = ['pointssub 5'];

export function run(message) {
    const msg = utils.stripCommand(message);
    const userRow = utils.getUserPointsRow(message.guild, message.author);

    if (!msg || msg === '0') {
        return message.channel.send(`You have **${userRow.points}** points, ${message.author.username}!`);
    }

    const number = parseInt(msg, 10);
    if (isNaN(number)) {
        return message.channel.send(utils.formatResponse('neg', 'Failed', `\`${msg}\` isn't a number!`));
    }

    const newPoints = number > userRow.points ? 0 : userRow.points - number;
    userRow.name = message.author.username;
    userRow.pointsFormula = utils.appendFormula(userRow.pointsFormula, `-${newPoints ? number : userRow.points}`);
    userRow.points = newPoints;

    GUILD_TEMP[message.guild.id].POINTS[message.author.id] = userRow;
    utils.updateSpreadsheet(message.guild)
    .then(() => message.channel.send(utils.formatResponse('pos', '',
        `${message.author.username}: **-${number}**! Total: **${userRow.points}**`)))
    .catch(err =>  message.channel.send(utils.formatResponse('neg', 'Failed saving', err)));
}
