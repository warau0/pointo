import Discord from 'discord.io';
import logger from 'winston';

import auth from './auth.json';
import * as utils from './utils';

const commandChar = ['!', ''];

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

const bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
  if (utils.isCommand(message)) {
    let args = message.substring(1).split(' ');
    let cmd = args[0];
    args = args.splice(1);

    switch(cmd) {
      // !ping
      case 'ping':
        bot.sendMessage({
          to: channelID,
          message: 'Pong!'
        });
        break;
      default: break;
    }
  }
});