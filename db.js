// C:\Users\user\Desktop\projects\death-express\db.js

// C:\Users\user\Desktop\projects\death-express\db.js

const mysql = require('mysql2/promise');

// Use the DATABASE_URL environment variable directly
const connectionString = process.env.DATABASE_URL || 'mysql://root:AaBUkersWTTvBHxHEPbLhWkaJuzhbTUM@mysql.railway.internal:3306/railway';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: connectionString.split(':')[2],
  user: connectionString.split(':')[3].split('@')[0],
  password: connectionString.split(':')[4].split(':')[0],
  database: connectionString.split(':')[4].split('/')[0],
  port: parseInt(connectionString.split(':')[3].split(':')[1]),
});

const db = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};

module.exports = { mysqlConnection: pool, pgPool: null };