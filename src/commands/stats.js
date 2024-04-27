const pkg = require('../../package.json');

export const usage = 'stats';
export const short = 'General bot statistics.';
export const description = `Check if the bot is responsive and get some general statistics.`;
export const aliases = ['ping'];
export const examples = [];
export const group = 'utlity';

export async function run(message) {
    const upS = Math.ceil((CLIENT.uptime / 1000) % 60).toString().padStart(2, '0');
    const upM = Math.floor(((CLIENT.uptime / 1000) % (60 * 60)) / 60).toString().padStart(2, '0');
    const upH = Math.floor(((CLIENT.uptime / 1000) % (60 * 60 * 24)) / (60 * 60)).toString().padStart(2, '0');
    const upD = Math.floor((CLIENT.uptime / 1000) / (60 * 60 * 24));

    const msg = await message.channel.send('Statistics\n==========', { code: 'asciidoc' });
    msg.edit(`
Statistics
==========
- Version      -  v${pkg.version}
- Uptime       -  ${upD} day${upD != 1 ? 's' : ''}, ${upH}:${upM}:${upS}
- Latency      -  ${msg.createdTimestamp - message.createdTimestamp} ms
- API Latency  -  ${Math.round(CLIENT.ping)} ms
- Mem usage    -  ${parseFloat(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
- Servers      -  ${CLIENT.guilds.size.toString()}
- Channels     -  ${CLIENT.channels.size.toString()}
- Users        -  ${CLIENT.users.size.toString()}
`, { code: 'asciidoc' });
}
