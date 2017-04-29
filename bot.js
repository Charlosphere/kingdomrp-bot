const Discord = require('discord.js');
const emoji = require('node-emoji');
const moment = require('moment');
const database = require('./database');
const config = require('./config.json');

const token = process.env.KINGDOMRP_TOKEN;
const bot = new Discord.Client();
const timestamp = () => moment(new Date).format('HH:mm:ss');

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username} at [${timestamp()}]!`);
  database.init();
});

// Messages listener
bot.on('message', msg => {

  // Help command
  if (msg.content.startsWith(`${config.trigger}help`)) {
    console.log(`[${timestamp()}] ${msg.author.username} used ${config.trigger}help command.`);
    msg.reply('Here are my commands.');
  }
});

bot.login(token);
