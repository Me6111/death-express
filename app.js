require('dotenv').config();

const express = require('express');
const cors = require('cors');
const TablesInfoService = require('./tablesInfo');
const app = express();
const db = require('./db');

const port = process.env.PORT || 3000;

app.use(cors());
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});