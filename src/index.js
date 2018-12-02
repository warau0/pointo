import fs from 'fs';
import Discord from 'discord.io';
import { google } from 'googleapis';

import * as utils from './utils';
import * as commands from './commands';
const config = require('../config.json');
const sheetID = config.sheetID;

let sheets = {};
let scores = {};

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  utils.googleAuth(JSON.parse(content), (auth) => {
    sheets = google.sheets({ version: 'v4', auth });
    utils.fetchScores(sheets, sheetID).then(result => {
      scores = result;
      console.log(`Google connection successful.`)
    });
  });
});

const bot = new Discord.Client({
  token: config.discord,
  autorun: true
});

/* bot.on('ready', () => {
  console.log(`Connected as ${bot.username}.`);
}); */

bot.on('message', (username, userID, channelID, fullMessage, evt) => {
  if (utils.isCommand(fullMessage)) {
    console.log(`[${username}] ${fullMessage}`);
    const args = fullMessage ? fullMessage.substring(1).split(' ') : ['invalid', ''];
    const command = args[0];
    const message = args.splice(1).join(' ');

    const send = (msg) => bot.sendMessage({ to: channelID, message: msg });

    switch(command) {
      case 'ping': commands.ping({ send }); break;
      case 'points':
      case 'plus':
      case 'add': commands.add({ send, username, userID, message, scores, sheets, sheetID  }); break;
      case 'sub':
      case 'minus':
      case 'subtract': commands.subtract({ send, username, userID, message, scores, sheets, sheetID  }); break;
      case 'hs':
      case 'scores':
      case 'hiscore':
      case 'hiscores':
      case 'highscore':
      case 'highscores':
      case 'leaderboard':
      case 'leaderboards': commands.leaderboard({ send, sheetID }); break;
      case 'reset':
      case 'archive': commands.archive({ send }); break; // TODO
      case 'commands':
      case 'help': commands.help({ send }); break;
      case 'reload': {
        utils.fetchScores(sheets, sheetID).then(result => {
          scores = result;
          send('Leaderboard reloaded. :sparkles:')
        });
        break;
      }
      default: break;
    }
  }
});