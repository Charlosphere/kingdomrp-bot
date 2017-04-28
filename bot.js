const Discord = require('discord.js');
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
  if (msg.author.bot) return;
  if (!msg.content.startsWith(config.trigger)) return;

  let command = msg.content.split(" ")[0];
  command = command.slice(config.trigger.length);

  // Help command
  if (command === 'help') {
    console.log(`[${timestamp()}] ${msg.author.username} used $help command.`);
    msg.reply('Here are my commands.');
  }
});

bot.login(token);