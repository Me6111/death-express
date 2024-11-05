require('dotenv').config();

const express = require('express');
const cors = require('cors');
const TablesInfoService = require('./tablesInfo');
const app = express();
const db = require('./db');

const port = process.env.PORT || 3000;

// Handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

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
    console.log('Fetching tables and columns...');
    const tablesInfo = await tablesInfoService.fetchTablesAndColumns();
    console.log('Tables fetched:', JSON.stringify(tablesInfo));
    res.json(tablesInfo);
  } catch (error) {
    console.error('Error fetching tables and columns:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Test database connection route
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.pool.query('SELECT NOW() AS current_time');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection failed');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});