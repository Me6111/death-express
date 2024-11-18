const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*' // Allow requests from any origin (adjust as needed)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import the database functions
const { execute_qq } = require('./db');

// Routes
app.get('/', (req, res) => {
  res.send('Hello from the root path!');
});

app.get('/hello', (req, res) => {
  res.send('Hello client');
});

app.post('/execute_qq', async (req, res) => {
  try {
    const query = req.body.query;
    const results = await execute_qq(query);
    
    res.json(results);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Failed to execute query' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});