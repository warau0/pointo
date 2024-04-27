import {google} from "googleapis/build/src/index";
require('@babel/polyfill');
import Discord from 'discord.js';
const bodyParser = require('body-parser');
const app = require('express')();
app.use(bodyParser.json());

import * as utils from './utils';
import commands from './commands';

/**
 * Global variables:
 *
 * CLIENT: Connected Discord websocket client.
 * CONFIG: Global bot config, has for example Discord API key.
 * GOOGLE_AUTH: OAuth2 client used when generating access tokens.
 * GUILD_CONFIGS: Local bot configs for all connected servers, has for example command prefix.
 * GUILD_TEMP: Guild things that shouldn't be saved to disk, such as Google auth client.
 */
global.CLIENT = new Discord.Client();
global.CONFIG = {};
global.GOOGLE_AUTH = null;
global.GUILD_CONFIGS = {};
global.GUILD_TEMP = {};

try {
  CONFIG = require('../config.json');
  global.GOOGLE_AUTH = new google.auth.OAuth2(
    CONFIG.GOOGLE_CLIENT_ID, CONFIG.GOOGLE_CLIENT_SECRET, 'urn:ietf:wg:oauth:2.0:oob',
  );
} catch(e) {
  throw('Error: config.json file does not exist in project root.');
}

CLIENT.on('ready', () => {
  utils.checkReboot();
  utils.loadGuildConfigs(CLIENT.guilds);
  CLIENT.user.setActivity('Give me your points!');
  console.log(`Logged in in as ${CLIENT.user.tag}!`);
  console.log(`Serving ${CLIENT.guilds.size} server${CLIENT.guilds.size > 1 ? 's' : ''}`);
});

CLIENT.on('guildCreate', guild => {
  utils.guildCreate(guild);
  console.log(`New guild: ${guild.name} (id: ${guild.id}), users: ${guild.memberCount}`);
  console.log(`Serving ${CLIENT.guilds.size} server${CLIENT.guilds.size > 1 ? 's' : ''}`);
});

/* Due to connectively issues with Discord the leave functionality is disabled.
CLIENT.on('guildDelete', guild => {
  utils.guildDelete(guild);
  console.log(`Deleted guild: ${guild.name} (id: ${guild.id})`);
  console.log(`Serving ${CLIENT.guilds.size} server${CLIENT.guilds.size > 1 ? 's' : ''}`);
});
*/

CLIENT.on('message', async message => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const prefix = utils.getPrefix(message);
  if(!message.content.toLowerCase().startsWith(prefix)) return;

  const cmd = commands[message.content.split(' ')[0].slice(prefix.length).toLowerCase()];
  if (cmd) cmd.run(message);
});

CLIENT.on('error', err => {
  console.error(err);
  process.exit(1);
});

CLIENT.login(CONFIG.DISCORD_TOKEN);
