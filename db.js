// C:\Users\user\Desktop\projects\death-express\db.js

const { Pool } = require('pg');
const mysql = require('mysql2/promise');

// Use the DATABASE_URL environment variable directly
const connectionString = process.env.DATABASE_URL || 'mysql://root:AaBUkersWTTvBHxHEPbLhWkaJuzhbTUM@mysql.railway.internal:3306/railway';

const pool = new Pool({
  connectionString: connectionString,
});

const db = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};

module.exports = { mysqlConnection: mysql.createConnection(connectionString), pgPool: pool };
