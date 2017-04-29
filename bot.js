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

bot.on('guildCreate', guild => {
  database.addAllUsers(bot.channels);
});

bot.on('guildMemberAdd', member => {
  database.addUser(member.user.id, member.user.username);
});

bot.on('guildMemberRemove', member => {
  database.removeUser(member.user.id);
});

bot.on('message', msg => {

  // Help command
  if (msg.content === '$help') {
    console.log(`[${timestamp()}] ${msg.author.username} used $help command.`);
    msg.reply('Here are my commands.');
  }

  // Super-user give: magically give gold to any player
  else if (msg.content.startsWith('$sugive')) {
    database.getPromotion(msg.author.id, (err, row) => {
      // If he's an admin or a super admin...
      if (row.admin === 1 || row.suadmin === 1) {
        // If a user is mentionned in the message...
        if (msg.mentions.users.first() !== undefined) {
          // If the message contains a number...
          let match = /\s\d+/.exec(msg.content);
          if (match !== null) {
            database.getGold(msg.mentions.users.first().id, (err, row) => {
              database.updateGold(msg.mentions.users.first().id, row.gold + parseInt(match[0]))
            });
          }
        }
      }
    });
  }
});

bot.login(token);