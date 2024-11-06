const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

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
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'mysql.railway.internal',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'AaBUkersWTTvBHxHEPbLhWkaJuzhbTUM',
            database: process.env.DB_NAME || 'railway',
            port: process.env.DB_PORT || 3306,
        });

        const [rows] = await connection.execute('SELECT * FROM ALBUMS');
        
        res.json(rows);
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    } finally {
        await connection.end();
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