import fs from 'fs';
import path from 'path';

export const usage = 'reboot';
export const short = 'Reboot the bot.';
export const description = `Kills the bot process and hopes pm2 restarts it.`;
export const aliases = ['boot', 'restart', 'kill'];
export const examples = [];
export const group = 'utlity';

export async function run(message) {
    if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

    const msg = await message.channel.send('Rebooting...');
    fs.writeFile(path.resolve('./reboot.json'), JSON.stringify({
        channel: msg.channel.id,
        time: +new Date(),
    }), () => {
        process.exit(1);
    });
}
