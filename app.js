const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from the root path!');
});

app.get('/hello', (req, res) => {
  res.send('Hello client');
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error(`Error starting server: ${error}`);
});