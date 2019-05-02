import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

import * as utils from '../utils';

export const usage = 'reboot';
export const short = 'Update and reboot the bot.';
export const description = `Checks for updates, rebuilds the project and finally kills the bot process with hopes of pm2 restarting it.`;
export const aliases = ['boot', 'restart', 'kill'];
export const examples = [];
export const group = 'utlity';

export async function run(message) {
  if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

  const msg = await message.channel.send('Checking for updates ...');
  exec('git fetch && git reset --hard origin/master', async err => {
    if (!err) {
      await msg.edit('Building ...');
      exec('yarn build', async err => {
        if (!err) {
          await msg.edit('Rebooting ...');
          fs.writeFile(path.resolve('./reboot.json'), JSON.stringify({
            channel: msg.channel.id,
            time: +new Date(),
          }), () => {
            process.kill(process.pid, 'SIGINT'); // Say goodnight.
          });
        }
      })
    }
  });
}