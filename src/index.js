import fs from 'fs';
import Discord from 'discord.io';
import { google } from 'googleapis';

import * as utils from './utils';
import * as commands from './commands';

let config;
try {
  config = require('../config.json');
} catch(e) {
  throw('Error: config.json file does not exist in project root.');
}
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

    switch(command.toLowerCase()) {
      case 'ping': commands.ping({ send }); break;
      case 'commands':
      case 'help': commands.help({ send }); break;
      case 'points':
      case 'plus':
      case 'add': commands.add({ send, username, userID, message, scores, sheets, sheetID  }); break;
      case 'sub':
      case 'minus':
      case 'subtract': commands.subtract({ send, username, userID, message, scores, sheets, sheetID  }); break;
      case 'data':
      case 'leaderboard': commands.leaderboard({ send, sheetID }); break;
      case 'print':
      case 'scores': commands.leaderboard({ send, sheetID, scores }); break;
      case 'house': commands.enterHouse({ send, username, userID, message, scores, sheets, sheetID }); break;

      // Admin
      case 'give': commands.give({ send, config, userID, message, scores, sheets, sheetID }); break;
      case 'take': commands.take({ send, config, userID, message, scores, sheets, sheetID }); break;
      case 'reset':
      case 'archive': commands.archive({ send, config, userID }); break; // TODO
      case 'sheet': commands.setSheetID({ send, config, userID, message, evt }); break; // TODO
      case 'auth': commands.setGoogleAuth({ send, config, userID, message, evt }); break; // TODO
      case 'admin': commands.setAdmin({ send, config, userID, message, evt }); break; // TODO

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