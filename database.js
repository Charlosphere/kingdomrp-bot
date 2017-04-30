const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('kingdomrp.db');

exports.init = channels => {
  db.run('CREATE TABLE IF NOT EXISTS user (' +
         'id VARCHAR(45) PRIMARY KEY,' +
         'username VARCHAR(45) NOT NULL,' +
         'gold INTEGER NOT NULL,' +
         'admin INTEGER NOT NULL,' +
         'suadmin INTEGER NOT NULL);', () => {
           this.addAllUsers(channels);
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
};

exports.addUser = (id, username) => {
  db.run('INSERT INTO user (' +
         'id, username, gold, admin, suadmin) VALUES (' +
         '?, ?, 0, 0, 0);', id, username, () => {
          /* error handling */
        });
};

exports.addAllUsers = channels => {
  channels.map(channel => {
    channel.members.map(member => {
      if (!member.user.bot) {
        this.addUser(member.user.id, member.user.username);
      }
    });
  })
};

exports.removeUser = id => {
  db.run('DELETE FROM user WHERE id = ?;', id);
};

exports.promoteUser = (id, value) => {
  db.run('UPDATE user SET admin = ? WHERE id = ?;', value, id);
};

exports.getPromotion = (id, callback) => {
  db.get('SELECT admin, suadmin FROM user WHERE id = ?;', id, callback);
};

exports.getGold = (id, callback) => {
  db.get('SELECT gold FROM user WHERE id = ?;', id, callback);
};

exports.getAdmins = callback => {
  db.all('SELECT username FROM user WHERE admin = 1;', callback);
};

exports.updateGold = (id, gold) => {
  db.run('UPDATE user SET gold = ? WHERE id = ?;', gold, id);
};

exports.rankGold = callback => {
  db.all('SELECT username, gold FROM user ORDER BY gold DESC LIMIT 10;', callback);
};
