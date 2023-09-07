const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "Aze69!",
    host: "localhost",
    port: 5432,
    database: "bdd_les_recettes_de_sabine"
});

module.exports = pool;