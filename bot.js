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
  if (msg.author.bot) return;
  if (!msg.content.startsWith(config.trigger)) return;

  let command = msg.content.split(" ")[0];
  command = command.slice(config.trigger.length);

  // Help command
  if (command === 'help') {
    console.log(`[${timestamp()}] ${msg.author.username} used ${config.trigger}help command.`);
    msg.reply('Here are my commands.');
  }

  // Store command
  if (command === 'store') {
      console.log(`[${timestamp()}] ${msg.author.username} used ${config.trigger}store command.`);
      msg.reply(`Here\'s what you can buy:\n
                ${emoji.get('dagger')} Donne +1 chance de tuer (2 000 ${emoji.get('moneybag')})\n
                ${emoji.get('shield')} Donne +1 chance de survivre (2 000 ${emoji.get('moneybag')})\n
                ${emoji.get('bow_and_arrow')} Permet de tuer à partir de la prison (3 000 ${emoji.get('moneybag')})\n
                ${emoji.get('bomb')} Permet de tuer deux personne avec un roll (5 000 ${emoji.get('moneybag')})\n
                ${emoji.get('four_leaf_clover')} Permet de roll (20 000 ${emoji.get('moneybag')})\n`);
  }
});

bot.login(token);