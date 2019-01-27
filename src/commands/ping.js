import Discord from 'discord.js';

export const usage = 'ping';
export const short = 'Anybody home?';
export const description = `Check if the bot is responsive and get some statistics.`;
export const aliases = ['stats'];
export const examples = [];

export async function run(message) {
    const upS = Math.floor(CLIENT.uptime / 1000).toString().padStart(2, '0');
    const upM = Math.floor(upS / 60).toString().padStart(2, '0');
    const upH = Math.floor(upM / 60).toString().padStart(2, '0');
    const upD = Math.floor(upH / 24);

    const msg = await message.channel.send('Statistics\n==========', { code: 'asciidoc' });
    msg.edit(`
Statistics
==========
- Uptime       -  ${upD} day${upD != 1 ? 's' : ''}, ${upH}:${upM}:${upS}
- Latency      -  ${msg.createdTimestamp - message.createdTimestamp} ms
- API Latency  -  ${Math.round(CLIENT.ping)} ms
- Mem usage    -  ${parseFloat(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
- Servers      -  ${CLIENT.guilds.size.toString()}
- Channels     -  ${CLIENT.channels.size.toString()}
- Users        -  ${CLIENT.users.size.toString()}
`, { code: 'asciidoc' });
}
