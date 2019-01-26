export const usage = 'ping';
export const short = 'Anybody home?';
export const description = `Check if the bot is responsive and how much latency commands currently have.`;
export const aliases = [];
export const examples = [];

export async function run(message) {
    const msg = await message.channel.send('Pong! ~');
    msg.edit(
        `Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. ` +
        `API Latency is ${Math.round(CLIENT.ping)}ms.`
    );
}
