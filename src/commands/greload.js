import * as utils from '../utils';

export const usage = 'greload';
export const short = 'Reload Google sheet.';
export const description = 'Reload the spreadsheet data. Use this if you manually edit the spreadsheet.';
export const aliases = ['googlereload', 'reload', 'refresh'];
export const examples = [];
export const group = 'settings';

export function run(message) {
    if (!GUILD_CONFIGS[message.guild.id].GOOGLE_TOKEN) {
        return message.channel.send(utils.formatResponse('neg', 'Missing authentication',
            `Run \`${utils.getPrefix(message)}gauth\` to setup Google authentication.`));
    }

    if (GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_ID && GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_NAME) {
        utils.loadSpreadsheet(message.guild).then(res => {
            GUILD_TEMP[message.guild.id].POINTS = res;
            message.channel.send('Points reloaded. :sparkles:');
        })
        .catch(err =>  message.channel.send(utils.formatResponse('neg', 'Failed reloading', err)));
    } else {
        message.channel.send(utils.formatResponse('neg', 'Missing setup', `The variables \`GOOGLE_SHEET_ID\` and \`GOOGLE_SHEET_NAME\` must be set in order to use a spreadsheet. See \`${utils.getPrefix(message)}key\` command.`));
    }
}