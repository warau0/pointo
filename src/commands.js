import avatar from './commands/avatar';
import help from './commands/help';
import ping from './commands/ping';
import prefix from './commands/prefix';
import source from './commands/source';

const exampleUser = '@warau';

export default {
    avatar: {
        cmd: avatar,
        aliases: [],
        short: 'Get avatar link.',
        description: `Get the image used as either your own or someone else's avatar.`,
        examples: [
            'avatar',
            `avatar ${exampleUser}`,
        ],
    },
    help: {
        cmd: help,
        aliases: ['h'],
        short: 'Command list and help.',
        description: 'List the total list of commands or get specifics on a single command.',
        examples: [
            'help',
            'help avatar',
        ],
    },
    h: { cmd: help, alias: true },
    ping: {
        cmd: ping,
        aliases: [],
        short: 'Anybody home?',
        description: 'Quickly check if the bot is responsive and how much latency commands currently have.',
    },
    prefix: {
        cmd: prefix,
        aliases: [],
        short: 'Check and set command prefix.',
        description: 'Check the current command prefix or change it to something else.',
        examples: [
            'prefix',
            'prefix -',
        ],
    },
    source: {
        cmd: source,
        aliases: ['github'],
        short: 'View my source code.',
        description: 'Prints a link to the project repository hosting the full source code for this project.',
    },
    github: { cmd: source, alias: true },
}
