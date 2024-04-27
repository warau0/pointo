import * as utils from '../utils';

export const usage = 'say <text>';
export const short = 'Make the bot say something.';
export const description = 'It can say anything.';
export const aliases = [];
export const examples = ['say Hello'];
export const group = 'utlity';

export function run(message) {
    const msg = utils.stripCommand(message);
    message.channel.send(msg);
}