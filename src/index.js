import { REST, Routes, Client, GatewayIntentBits } from 'discord.js';
import { google } from 'googleapis';
import express from 'express';
import fs from 'fs';
import open from 'open';
import commands, { command_list } from './command_list.js';
import config from '../config.json' with { type: 'json' };

const registerCommands = async (config) => {
  try {
    const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), { body: command_list });
    console.log('Successfully reloaded commands.');
  } catch (error) {
    console.error(error);
  }
}

const discordLogin = (config, googleAuthClient) => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.on('ready', () => {
    console.log(`Logged in and ready as ${client.user.tag}.`);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
      switch(interaction.commandName) {
        case 'ping': await commands.ping(config, interaction); break;
        case 'leaderboard': await commands.leaderboard(config, interaction, googleAuthClient); break;
        case 'points': await commands.points(config, interaction, googleAuthClient); break;
        default: break;
      }
    } catch (err) {
      console.error(err);
    }
  });

  client.login(config.DISCORD_TOKEN);
}

const listenForOAuthCallback = (googleAuthClient, googleAuthUrl) => {
  const app = express();

  app.get('/oauth2callback', (req, res) => {
    const code = req.query.code;

    googleAuthClient.getToken(code, (err, tokens) => {
      if (err) {
        console.error('Error getting OAuth tokens.');
        throw err;
      }
      fs.writeFileSync('./auth.json', JSON.stringify(tokens))
      googleAuthClient.setCredentials(tokens);
      console.log('Google credentials set.')
      res.send('Google auth successful.');
      server.close();
    });
  });

  const server = app.listen(3000, () => {
    open(googleAuthUrl, { wait: false });
  });
}

const googleLogin = (config) => {
  const googleAuthClient = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/oauth2callback'
  );

  try {
    const tokens = JSON.parse(fs.readFileSync('./auth.json', 'utf8'));
    googleAuthClient.setCredentials(tokens);
    console.log('Google credentials set.')
  } catch (err) {
    const googleAuthUrl = googleAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  
    listenForOAuthCallback(googleAuthClient, googleAuthUrl)
  }
  return googleAuthClient;
}

const googleAuthClient = googleLogin(config)

registerCommands(config)
discordLogin(config, googleAuthClient)
