const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'proiect_pw',
  password: 'parola123',
  port: 5432,
});

module.exports = pool;
