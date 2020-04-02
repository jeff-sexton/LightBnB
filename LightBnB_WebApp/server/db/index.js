require('dotenv').config(); // Add DB environment variables

const user = process.env.DB_USER || 'vagrant';
const password = process.env.DB_PASSWORD || '123';
const host = process.env.DB_HOST || 'localhost';
const database = process.env.DB_DATABASE || 'lightbnb';

// Establish database pool
const { Pool } = require('pg');
const pool = new Pool({
  user,
  password,
  host,
  database
});

// Export Pool for use in queries with query logging attached
module.exports = {
  query: (text, params) => {
    const start = Date.now();
    return pool.query(text, params)
      .then(res => {
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount});
        return res;
      });
  }

};