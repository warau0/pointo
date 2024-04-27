export const usage = 'support';
export const short = 'Donate to the developer.';
export const description = `Prints a link to a donation page.`;
export const aliases = ['donate'];
export const examples = [];
export const group = 'utlity';

export function run(message) {
    message.channel.send(`Donate to keep bot alive: __${'https://ko-fi.com/warau_'}__`);
}
