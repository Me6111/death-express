const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

// Allow CORS from all origins
app.use(cors({ origin: '*' }));

app.use(express.json());

// Define Albums class
class Albums {
  constructor(dbUrl) {
    this.dbUrl = dbUrl;
    this.connection = mysql.createConnection(this.dbUrl);
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

// Initialize Albums instance
const AlbumsInstance = new Albums(process.env.DATABASE_URL);

// Root path route
app.get('/', (req, res) => {
  res.send('Hello from the root path!');
});

// Hello route
app.get('/hello', (req, res) => {
  res.send('Hello client');
});

// Albums route
app.get('/albums', async (req, res) => {
  try {
    const tablesInfo = await AlbumsInstance.getAlbums();
    res.json(tablesInfo);
  } catch (error) {
    console.error('Error fetching tables and columns:', error);
    res.status(500).send({ message: 'Internal Server Error', details: error.message });
  }
});

// Add CORS middleware to all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});