import * as utils from '../utils';

export const usage = 'house <user> <house>';
export const short = 'Put someone in a house.';
export const description = `Put someone in a house or view what house someone is currently in.`;
export const aliases = ['assign', 'join'];
export const examples = ['house @warau', 'house @warau Big Goobers'];
export const group = 'points';

export function run(message) {
    if (!GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_ID || !GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_NAME) {
        return message.channel.send(utils.formatResponse('neg', 'Missing setup', `The variables \`GOOGLE_SHEET_ID\` and \`GOOGLE_SHEET_NAME\` must be set in order to use a spreadsheet. See \`${utils.getPrefix(message)}key\` command.`));
    }

    if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

    const msg = utils.stripCommand(message);

    if (!msg || !message.mentions.members.first()) {
        return message.channel.send(utils.formatResponse('neg', 'No user',
            'Tag someone to see their house or assign them to one.'));
    }

    const user = message.mentions.members.first().user;
    const userRow = utils.getUserPointsRow(message.guild, user);
    const house = utils.stripMentions(msg);
    if (!house) {
        if (userRow.house) {
            return message.channel.send(`**${user.username}** is currently in **${userRow.house}**`);
        } else {
            return message.channel.send(`**${user.username}** is not currently in a house.`);
        }
    }

    userRow.name = user.username;
    userRow.house = house;

    GUILD_TEMP[message.guild.id].POINTS[user.id] = userRow;
    utils.updateSpreadsheet(message.guild)
        .then(() => message.channel.send(utils.formatResponse('pos', '',
            `**${userRow.name}** is now in the **${house}** house!`)))
        .catch(err =>  message.channel.send(utils.formatResponse('neg', 'Failed saving', err)));
}
