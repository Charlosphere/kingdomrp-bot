const sqlite3 = require('sqlite3').verbose();
const db = {};

exports.init = guilds => {
  guilds.map((guild) => {
    if (!(guild.id in db)) {
      db[guild.id] = new sqlite3.Database(`${guild.id}.db`);
    }

    db[guild.id].run('CREATE TABLE IF NOT EXISTS user (' +
          'id VARCHAR(45) PRIMARY KEY,' +
          'username VARCHAR(45) NOT NULL,' +
          'gold INTEGER NOT NULL,' +
          'admin INTEGER NOT NULL,' +
          'suadmin INTEGER NOT NULL);', () => {
            this.addAllUsers(guild);
          });

    db[guild.id].run('CREATE TABLE IF NOT EXISTS item (' +
          'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
          'name VARCHAR(45) NOT NULL,' +
          'description VARCHAR(150) NOT NULL,' +
          'emoji VARCHAR(45) NOT NULL,' +
          'price INTEGER NOT NULL,' +
          'attack INTEGER NOT NULL,' +
          'defense INTEGER NOT NULL,' +
          'roll INTEGER NOT NULL,' +
          'target INTEGER NOT NULL,' +
          'from_jail INTEGER NOT NULL);');

    db[guild.id].run('CREATE TABLE IF NOT EXISTS inventory (' +
          'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
          'user_id VARCHAR(45) REFERENCES user(id), ' +
          'item_id INTEGER REFERENCES item(id));');
  });
};

exports.addUser = (guild, id, username) => {
  db[guild.id].run('INSERT INTO user (' +
         'id, username, gold, admin, suadmin) VALUES (' +
         '?, ?, 0, 0, 0);', id, username, () => {
          /* error handling */
        });
};

exports.addAllUsers = guild => {
  guild.channels.map(channel => {
    channel.members.map(member => {
      if (!member.user.bot) {
        this.addUser(guild, member.user.id, member.user.username);
      }
    });
  })
};

exports.removeUser = (guild, id) => {
  db[guild.id].run('DELETE FROM user WHERE id = ?;', id);
};

exports.promoteUser = (guild, id, value) => {
  db[guild.id].run('UPDATE user SET admin = ? WHERE id = ?;', value, id);
};

exports.getPromotion = (guild, id, callback) => {
  db[guild.id].get('SELECT admin, suadmin FROM user WHERE id = ?;', id, callback);
};

exports.getGold = (guild, id, callback) => {
  db[guild.id].get('SELECT gold FROM user WHERE id = ?;', id, callback);
};

exports.getAdmins = (guild, callback) => {
  db[guild.id].all('SELECT username FROM user WHERE admin = 1;', callback);
};

exports.updateGold = (guild, id, gold) => {
  db[guild.id].run('UPDATE user SET gold = ? WHERE id = ?;', gold, id);
};

exports.rankGoldTopTen = (guild, callback) => {
  db[guild.id].all('SELECT username, gold FROM user ORDER BY gold DESC LIMIT 10;', callback);
};

exports.rankGoldAll = (guild, callback) => {
  db[guild.id].all('SELECT id, gold FROM user ORDER BY gold DESC;', callback);
};
