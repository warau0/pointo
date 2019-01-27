const pkg = require('../../package.json');

export const usage = 'source';
export const short = 'View my source code.';
export const description = `Prints a link to the project repository hosting the full source code for this project.`;
export const aliases = ['github'];
export const examples = [];
export const group = 'utlity';

export function run(message) {
    message.channel.send(`Project source code: __${pkg.homepage}__`);
}
