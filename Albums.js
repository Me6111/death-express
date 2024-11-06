// albums.js
const { connectToDatabase, queryAlbums } = require('./db');

async function fetchAlbums() {
  let conn;
  try {
    conn = await connectToDatabase();
    const albums = await queryAlbums(conn);
    await conn.end();
    console.log('Successfully fetched albums');
    return albums;
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
}

module.exports = { fetchAlbums };