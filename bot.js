const Discord = require('discord.js');
const moment = require('moment');
const database = require('./database');

const timestamp = () => moment(new Date).format('HH:mm:ss');
const token = process.env.KINGDOMRP_TOKEN;
const bot = new Discord.Client();

bot.on('ready', () => {
  console.log(`${bot.user.username} launched at [${timestamp()}]!`);
  database.init(bot.channels);
});

bot.on('guildCreate', (guild) => {
  database.addAllUsers(bot.channels);
});

bot.on('guildMemberAdd', (member) => {
  database.addUser(member.user.id, member.user.username);
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