import * as utils from '../utils';

export const usage = 'leaderboard <count>';
export const short = 'View all the points.';
export const description = `Either prints the link to the spreadsheet or top X / all users.`;
export const aliases = ['scores', 'leaderboards', 'top'];
export const examples = ['leaderboard', 'leaderboard 5', 'leaderboard all'];
export const group = 'points';

export function run(message) {
    const msg = utils.stripCommand(message);

    if (!GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_ID) {
        return message.channel.send(utils.formatResponse('neg', 'Missing setup', `The \`GOOGLE_SHEET_ID\` variable must be set. See \`${utils.getPrefix(message)}key\` command.`));
    }

    if (!GUILD_TEMP[message.guild.id].POINTS || !Object.keys(GUILD_TEMP[message.guild.id].POINTS).length) {
      message.channel.send(utils.formatResponse('neg', `The leaderboard is empty.`));
      return;
    }

    let response = ':trophy: **Houses Leaderboard**:\n';

    if (!msg) {
        message.channel.send(`${response}__https://docs.google.com/spreadsheets/d/${GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_ID}__`)
    } else if (msg === 'all') {
        Object.keys(GUILD_TEMP[message.guild.id].POINTS)
            .sort((a, b) => GUILD_TEMP[message.guild.id].POINTS[b].points - GUILD_TEMP[message.guild.id].POINTS[a].points)
            .forEach((key, index) => {
                if (GUILD_TEMP[message.guild.id].POINTS.hasOwnProperty(key)) {
                    response += `**#${index + 1}** ${GUILD_TEMP[message.guild.id].POINTS[key].name}: **${GUILD_TEMP[message.guild.id].POINTS[key].points}**\n`
                }
            });
        message.channel.send(response);
    } else if (!isNaN(parseInt(msg, 10))) {
        Object.keys(GUILD_TEMP[message.guild.id].POINTS)
            .sort((a, b) => GUILD_TEMP[message.guild.id].POINTS[b].points - GUILD_TEMP[message.guild.id].POINTS[a].points)
            .filter((_, index) => index < parseInt(msg, 10))
            .forEach((key, index) => {
                if (GUILD_TEMP[message.guild.id].POINTS.hasOwnProperty(key)) {
                    response += `**#${index + 1}** ${GUILD_TEMP[message.guild.id].POINTS[key].name}: **${GUILD_TEMP[message.guild.id].POINTS[key].points}**\n`
                }
            });
        message.channel.send(response);
    } else {
        message.channel.send(utils.formatResponse('neg', 'Invalid input',
            `Please check your command. Refer to \`${utils.getPrefix(message)}help\` for the correct syntax.`));
    }
}
