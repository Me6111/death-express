// albums.js

const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'mysql.railway.internal',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'AaBUkersWTTvBHxHEPbLhWkaJuzhbTUM',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 3306,
};

async function connectToDatabase() {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
}

async function getAlbums(connection) {
  const query = 'SELECT * FROM Albums';
  try {
    const [rows] = await connection.execute(query);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

async function fetchAlbums() {
  const conn = await connectToDatabase();
  try {
    const albums = await getAlbums(conn);
    await conn.end();
    return albums;
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
}

module.exports = { fetchAlbums };