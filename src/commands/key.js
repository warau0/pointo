import * as utils from '../utils';

const keys = [
    'GOOGLE_SHEET_ID',
    'GOOGLE_SHEET_NAME',
    'STREAM_CHANNEL',
    'STREAM_ROLE'
];

export const usage = 'key <key> <value>';
export const short = 'Get / set local server variables.';
export const description = `Give the bot a key value pair local to your server.\n**Valid keys**: ${utils.encodedStringArray(keys)}.`;
export const aliases = ['var'];
export const examples = ['key GOOGLE_SHEET_ID', 'key GOOGLE_SHEET_ID 1dZHv5z2f-BcPuc...'];
export const group = 'settings';

export function run(message) {
    if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

    const keyValuePair = utils.stripCommand(message).split(' ');

    if (keyValuePair.length === 1 && keyValuePair[0]) {
        const key = keyValuePair[0].toUpperCase();
        const value = GUILD_CONFIGS[message.guild.id][key];
        if (validKey(key)) {
            if (value) {
                message.channel.send(`\`${key}\`: ${value}`);
            } else {
                message.channel.send(utils.formatResponse('neg', '', `\`${key}\` has not been set.`));
            }
        } else {
            message.channel.send(utils.formatResponse('neg', 'Invalid key', `Valid keys: ${utils.encodedStringArray(keys)}`));
        }
    } else if (keyValuePair.length === 2) {
        const key = keyValuePair[0].toUpperCase();
        const value = keyValuePair[1];

        if (validKey(key)) {
            utils.guildUpdate(message.guild, {
                ...GUILD_CONFIGS[message.guild.id],
                [key]: value
            });
            message.channel.send(utils.formatResponse('pos', '', `\`${key}\` saved.`));
        } else {
            message.channel.send(utils.formatResponse('neg', 'Invalid key', `Valid keys: ${utils.encodedStringArray(keys)}`));
        }
    } else {
        message.channel.send(utils.formatResponse('neg', 'Invalid input',
            `Please check your command. Refer to \`${utils.getPrefix(message)}help\` for the correct syntax.`));
    }

}

const validKey = (key) => {
    return keys.indexOf(key) !== -1;
}
