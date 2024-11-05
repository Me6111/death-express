// C:\Users\user\Desktop\projects\Death\death-express\app.js

const express = require('express');
const cors = require('cors');
const TablesInfoService = require('./tablesInfo'); // Ensure this path is correct
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
    // Directly send the structured data obtained from fetchTablesAndColumns
    res.json(tablesInfo);
  } catch (error) {
    console.error('Error fetching tables and columns:', error);
    res.status(500).send('Internal Server Error');
  }
});





