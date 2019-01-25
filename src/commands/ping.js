export default async function (message) {
    const msg = await message.channel.send('Pong! ~');
    msg.edit(
        `Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. ` +
        `API Latency is ${Math.round(CLIENT.ping)}ms.`
    );
}
