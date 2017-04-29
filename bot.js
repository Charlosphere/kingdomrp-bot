const Discord = require('discord.js');
const emoji = require('node-emoji');
const moment = require('moment');
const database = require('./database');
const config = require('./config.json');

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

  // #### PUBLIC COMMANDS ####

  // Help command
  if (msg.content.startsWith(`${config.trigger}help`)) {
    console.log(`[${timestamp()}] ${msg.author.username} used ${config.trigger}help command.`);
    msg.reply('Here are my commands.');
  }



  // ########################

  // #### ADMIN COMMANDS ####

  // Super-user give: magically give gold to any player
  else if (msg.content.startsWith(`${config.trigger}sugive`)) {
    if (msg.mentions.users.first() !== undefined) {
      let match = /\s\d+/.exec(msg.content); // regex: contains a number with whitespace before
      if (match !== null) {
        database.getPromotion(msg.author.id, (err, row) => {
          if (row.admin === 1 || row.suadmin === 1) {
            database.getGold(msg.mentions.users.first().id, (err, row) => {
              database.updateGold(msg.mentions.users.first().id, row.gold + parseInt(match[0]))
              msg.reply(`You magically transfered ${parseInt(match[0])} ${emoji.get('dollar')} to ${msg.mentions.users.first().username}.`);
            });
          }
        });
      }
    }
  }

  // Reset user: set gold to 0 (eventually reset inventory as well)
  else if (msg.content.startsWith(`${config.trigger}reset`)) {
    if (msg.mentions.users.first() !== undefined) {
      database.getPromotion(msg.author.id, (err, row) => {
        if (row.admin === 1 || row.suadmin === 1) {
          database.updateGold(msg.mentions.users.first().id, 0);
          msg.reply(`You reset ${msg.mentions.users.first().username}. Its balance is at 0 ${emoji.get('dollar')}.`);
        }
      });
    }
  }

  // ########################

  // #### SUPER-ADMIN COMMANDS ####

  // Promote user: Add as admin
  else if (msg.content.startsWith(`${config.trigger}promote`)) {
    if (msg.mentions.users.first() !== undefined) {
      database.getPromotion(msg.author.id, (err, row) => {
        if (row.suadmin === 1) {
          database.getPromotion(msg.mentions.users.first().id, (err, row) => {
            if (row.admin === 0) {
              database.promoteUser(msg.mentions.users.first().id, 1);
              msg.reply(`You promoted ${msg.mentions.users.first().username} as admin.`)
            }
            else {
              msg.reply(`${msg.mentions.users.first().username} is already an admin.`)
            }
          });
        }
      });
    }
  }

  // Demote user: Remove from admins
  else if (msg.content.startsWith(`${config.trigger}demote`)) {
    if (msg.mentions.users.first() !== undefined) {
      database.getPromotion(msg.author.id, (err, row) => {
        if (row.suadmin === 1) {
          database.getPromotion(msg.mentions.users.first().id, (err, row) => {
            if (row.admin === 1) {
              database.promoteUser(msg.mentions.users.first().id, 0);
              msg.reply(`You demoted ${msg.mentions.users.first().username}.`)
            }
            else {
              msg.reply(`${msg.mentions.users.first().username} is not an admin.`)
            }
          });
        }
      });
    }
  }

});

bot.login(token);
