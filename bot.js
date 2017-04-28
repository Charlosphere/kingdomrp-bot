const Discord = require('discord.js');
const moment = require('moment');

const token = process.env.KINGDOMRP_TOKEN;
const bot = new Discord.Client();
const timestamp = () => moment(new Date).format('HH:mm:ss');

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username} at [${timestamp()}]!`);
});

// Messages listener
bot.on('message', msg => {

  // Help command
  if (msg.content === '$help') {
    console.log(`[${timestamp()}] ${msg.author.username} used $help command.`);
    msg.reply('Here are my commands.');
  }
});

bot.login(token);