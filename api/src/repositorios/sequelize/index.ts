const Sequelize = require('sequelize')
const db = require('./config/database')

const { username, password, database, dialect, schema, host, port } = db

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  port,
  omitNull: true,
  define: {
    schema,
    timestamps: true,
    underscored: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
})

module.exports = sequelize
