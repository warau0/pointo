import fs from 'fs';
import path from 'path';

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

export function guildCreate(guild) {
  const emptyConfig = {
    id: guild.id,
    name: guild.name,
    prefix: null,
  };
  mkdirSync(path.resolve('./servers'));
  guildUpdate(guild, emptyConfig);
}

export function guildDelete(guild) {
  fs.unlinkSync(path.resolve(`./servers/${guild.id}.json`));
  delete GUILD_CONFIGS[guild.id];
}

export function guildsCheck(guilds) {
  mkdirSync(path.resolve('./servers'));

  guilds.forEach(guild => {
    fs.readFile(path.resolve(`./servers/${guild.id}.json`), (err, data) => {
      if (err) {
        const emptyConfig = {
          ID: guild.id,
          NAME: guild.name,
          PREFIX: null,
        };
        guildUpdate(guild, emptyConfig);
      } else {
        GUILD_CONFIGS[guild.id] = JSON.parse(data);
      }
    });
  });
}

export function guildUpdate(guild, config) {
  fs.writeFile(path.resolve(`./servers/${guild.id}.json`), JSON.stringify(config), () => {});
  GUILD_CONFIGS[guild.id] = config;
}

export function stripCommand(message) {
  if (message && message.content) {
    return message.content.split(' ').slice(1).join(' ');
  } else {
    return null;
  }
}