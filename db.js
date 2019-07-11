const Sequelize = require('sequelize')

const db = new Sequelize('postgres://postgres:12341234@localhost:5432/users')

const User =  db.define('user', {
  name: Sequelize.STRING,
  mail: Sequelize.STRING,
  password: Sequelize.STRING,
});

db.sync();

module.exports = {
  db,
  User,
}
