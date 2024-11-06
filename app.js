const express = require('express');
const cors = require('cors');
const TablesInfoService = require('./tablesInfo');
const app = express();
const db = require('./db');

const port = process.env.PORT || 3000;

// Allow CORS from all origins
app.use(cors({ origin: '*' }));

app.use(express.json());

const tablesInfoService = new TablesInfoService(process.env.DATABASE_URL);

// Root path route
app.get('/', (req, res) => {
  res.send('Hello from the root path!');
});

// Hello route
app.get('/hello', (req, res) => {
  res.send('Hello client');
});

// Tables-info route
app.get('/tables-info', async (req, res) => {
  try {
    const tablesInfo = await tablesInfoService.fetchTablesAndColumns();
    res.json(tablesInfo);
  } catch (error) {
    console.error('Error fetching tables and columns:', error);
    res.status(500).send('Internal Server Error');
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