// albums.js

const { mysqlConnection } = require('./db');

class Albums {
  constructor() {
    this.connection = mysqlConnection;
  }

  async getAlbums() {
    const query = 'SELECT * FROM Albums';
    try {
      const [rows] = await this.connection.execute(query);
      return rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}

module.exports = Albums;