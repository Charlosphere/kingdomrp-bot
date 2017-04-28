const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('kingdomrp.db');
 
exports.init = () => {
    db.run("CREATE TABLE IF NOT EXISTS user (" +
           "id VARCHAR(45) PRIMARY KEY," +
           "gold INTEGER NOT NULL);");

    db.run("CREATE TABLE IF NOT EXISTS item (" +
           "id INTEGER PRIMARY KEY AUTOINCREMENT," +
           "name VARCHAR(45) NOT NULL," +
           "description VARCHAR(150) NOT NULL," +
           "price INTEGER NOT NULL," +
           "attack INTEGER NOT NULL," +
           "defense INTEGER NOT NULL," +
           "roll INTEGER NOT NULL," +
           "target INTEGER NOT NULL," +
           "from_jail BOOLEAN NOT NULL);");

    db.run("CREATE TABLE IF NOT EXISTS inventory (" +
           "id INTEGER PRIMARY KEY AUTOINCREMENT," +
           "user_id VARCHAR(45) REFERENCES user(id), " +
           "item_id INTEGER REFERENCES item(id));");
    db.close();
};