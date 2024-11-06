// db.js
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'mysql.railway.internal',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'AaBUkersWTTvBHxHEPbLhWkaJuzhbTUM',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 3306,
};

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully');
    return connection;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

async function queryAlbums(connection) {
  const query = 'SELECT * FROM Albums';
  try {
    const [rows] = await connection.execute(query);
    console.log(`Retrieved ${rows.length} albums`);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

module.exports = { connectToDatabase, queryAlbums };