import * as dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA_AUTENTICADOR,
  dialect: process.env.DB_DIALECT,
  logging: process.env.DB_LOGGING === 'true'
}

// console.log(dbConfig)

module.exports = dbConfig
