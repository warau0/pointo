require('@babel/polyfill');
import Discord from 'discord.js';

import * as utils from './utils';
import commands from './commands';
import * as constants from './constants';

/**
 * Global variables:
 *
 * CLIENT: Connected Discord websocket client.
 * CONFIG: Global bot config, has for example Discord API key.
 * GUILD_CONFIGS: Local bot configs for all connected servers, has for example command prefix.
 */
global.CLIENT = new Discord.Client();
global.CONFIG = {};
global.GUILD_CONFIGS = {};

try {
  CONFIG = require('../config.json');
} catch(e) {
  throw('Error: config.json file does not exist in project root.');
}

CLIENT.on('ready', () => {
  utils.guildsCheck(CLIENT.guilds);
  CLIENT.user.setActivity('Give me your points!');
  console.log(`Logged in in as ${CLIENT.user.tag}!`);
  console.log(`Serving ${CLIENT.guilds.size} server${CLIENT.guilds.size > 1 ? 's' : ''}`);
});

CLIENT.on('guildCreate', guild => {
  utils.guildCreate(guild);
  console.log(`New guild: ${guild.name} (id: ${guild.id}), users: ${guild.memberCount}`);
  console.log(`Serving ${CLIENT.guilds.size} server${CLIENT.guilds.size > 1 ? 's' : ''}`);
});

CLIENT.on('guildDelete', guild => {
  utils.guildDelete(guild);
  console.log(`Deleted guild: ${guild.name} (id: ${guild.id})`);
  console.log(`Serving ${CLIENT.guilds.size} server${CLIENT.guilds.size > 1 ? 's' : ''}`);
});

CLIENT.on('message', async message => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const guildConfig = GUILD_CONFIGS[message.guild.id];
  const prefix = guildConfig ? guildConfig.PREFIX : constants.DEFAULT_PREFIX;
  if(!message.content.startsWith(prefix)) return;

  const cmd = commands[message.content.split(' ')[0].slice(prefix.length)];
  if (cmd) cmd.cmd(message);
});

CLIENT.login(CONFIG.DISCORD_TOKEN);
