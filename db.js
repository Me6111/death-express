
// C:\Users\user\Desktop\projects\death-express\db.js


const { Pool } = require('pg');

// Assuming you have a.env file or another method to securely store your database credentials
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
});

const db = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};

module.exports = db;