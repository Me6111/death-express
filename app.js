

// app.js


const express = require('express');
const cors = require('cors');
const albums = require('./albums'); // Corrected file path

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

app.get('/albums', async (req, res) => {
    try {
        const albums = await Albums.fetchAlbums();
        res.json(albums);
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).send({ message: 'Internal Server Error', details: error.message });
    }
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