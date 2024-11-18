const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable if set

// Middleware
app.use(cors({
  origin: '*' // Allow requests from any origin (adjust as needed)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from the root path!');
});

app.get('/hello', (req, res) => {
  res.send('Hello client');
});

// ... other routes

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});