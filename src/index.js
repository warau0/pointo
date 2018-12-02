import Discord from 'discord.io';

import * as utils from './utils';
import * as commands from './commands';

const bot = new Discord.Client({
  token: require('../auth.json').token,
  autorun: true
});

bot.on('ready', () => {
  console.log(`Connected as ${bot.username} - (${bot.id})`);
});

bot.on('message', (username, userID, channelID, fullMessage, evt) => {
  if (utils.isCommand(fullMessage)) {
    console.log(fullMessage);
    const args = fullMessage ? fullMessage.substring(1).split(' ') : ['invalid', ''];
    const command = args[0];
    const message = args.splice(1).join(' ');

    const send = (msg) => bot.sendMessage({ to: channelID, message: msg });

    switch(command) {
      case 'ping': commands.ping({ send }); break;
      case 'points':
      case 'plus':
      case 'add': commands.add({ send, username, userID, message }); break;
      case 'sub':
      case 'minus':
      case 'subtract': commands.subtract({ send, username, userID, message }); break;
      case 'hs':
      case 'scores':
      case 'hiscore':
      case 'hiscores':
      case 'highscore':
      case 'highscores':
      case 'leaderboard':
      case 'leaderboards': commands.leaderboard({ send }); break;
      case 'reset': commands.reset({ send, userID }); break;
      default: break;
    }
  }
});