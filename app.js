// app.js
const express = require('express');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from the root path!');
});

app.get('/hello', (req, res) => {
    res.send('Hello client');
});



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});