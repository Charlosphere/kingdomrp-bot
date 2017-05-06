const sqlite3 = require('sqlite3').verbose();

exports.init = guilds => {
  guilds.map((guild) => {
    const db = new sqlite3.Database(`${guild.id}.db`);

    db.run('CREATE TABLE IF NOT EXISTS user (' +
          'id VARCHAR(45) PRIMARY KEY,' +
          'username VARCHAR(45) NOT NULL,' +
          'gold INTEGER NOT NULL,' +
          'admin INTEGER NOT NULL,' +
          'suadmin INTEGER NOT NULL);', () => {
            this.addAllUsers(guild);
          });

    db.run('CREATE TABLE IF NOT EXISTS item (' +
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

    db.run('CREATE TABLE IF NOT EXISTS inventory (' +
          'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
          'user_id VARCHAR(45) REFERENCES user(id), ' +
          'item_id INTEGER REFERENCES item(id));');

    db.close();
  });
};

exports.addUser = (guild, id, username) => {
  const db = new sqlite3.Database(`${guild.id}.db`);

  db.run('INSERT INTO user (' +
         'id, username, gold, admin, suadmin) VALUES (' +
         '?, ?, 0, 0, 0);', id, username, () => {
          /* error handling */
        });

  db.close();
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
  const db = new sqlite3.Database(`${guild.id}.db`);
  db.run('DELETE FROM user WHERE id = ?;', id);
  db.close();
};

exports.promoteUser = (guild, id, value) => {
  const db = new sqlite3.Database(`${guild.id}.db`);
  db.run('UPDATE user SET admin = ? WHERE id = ?;', value, id);
  db.close();
};

exports.getPromotion = (guild, id, callback) => {
  const db = new sqlite3.Database(`${guild.id}.db`);
  db.get('SELECT admin, suadmin FROM user WHERE id = ?;', id, callback);
  db.close();
};

exports.getGold = (guild, id, callback) => {
  const db = new sqlite3.Database(`${guild.id}.db`);
  db.get('SELECT gold FROM user WHERE id = ?;', id, callback);
  db.close();
};

exports.getAdmins = (guild, callback) => {
  const db = new sqlite3.Database(`${guild.id}.db`);
  db.all('SELECT username FROM user WHERE admin = 1;', callback);
  db.close();
};

exports.updateGold = (guild, id, gold) => {
  const db = new sqlite3.Database(`${guild.id}.db`);
  db.run('UPDATE user SET gold = ? WHERE id = ?;', gold, id);
  db.close();
};

exports.rankGoldTopTen = (guild, callback) => {
  const db = new sqlite3.Database(`${guild.id}.db`);
  db.all('SELECT username, gold FROM user ORDER BY gold DESC LIMIT 10;', callback);
  db.close();
};

exports.rankGoldAll = (guild, callback) => {
  const db = new sqlite3.Database(`${guild.id}.db`);
  db.all('SELECT id, gold FROM user ORDER BY gold DESC;', callback);
  db.close();
};
