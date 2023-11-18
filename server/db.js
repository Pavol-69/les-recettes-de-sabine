const Pool = require("pg").Pool;
require("dotenv").config();

const devConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DB_NAME,
};

const pool = new Pool(devConfig);

module.exports = pool;
