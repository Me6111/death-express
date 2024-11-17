const express = require('express');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Add the cors middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    // Execute the query
    const results = await executeQQ(query);

    // Handle different types of queries
    if (query.toLowerCase().includes('create table') ||
      query.toLowerCase().includes('drop table')) {
      // For CREATE TABLE or DROP TABLE queries
      res.json({ success: true, message: 'Table operation completed successfully' });
    } else {
      // For SELECT queries
      res.json(results);
    }

  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ message: 'Query Execution Error', details: error.message });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error(`Error starting server: ${error}`);
});