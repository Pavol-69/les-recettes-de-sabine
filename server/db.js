const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres", //`${process.env.user}`,
  password: "Sql230!", //`${process.env.password}`,
  host: "localhost", //`${process.env.host}`,
  port: 5432,
  database: "bdd_les_recettes_de_sabine", //`${process.env.database}`,
});

module.exports = pool;
