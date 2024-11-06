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
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully');
    return connection;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

async function getAlbums(connection) {
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

async function fetchAlbums() {
  let conn;
  try {
    conn = await connectToDatabase();
    const albums = await getAlbums(conn);
    await conn.end();
    console.log('Successfully fetched albums');
    return albums;
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
}

module.exports = { fetchAlbums };