const express = require('express');
const cors = require('cors');
const { createConnection } = require('./db');

const app = express();

const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

let connection;

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).json({ message: 'Internal Server Error', details: err.message });
});

app.get('/', (req, res) => {
    res.send('Hello from the root path!');
});

app.get('/hello', (req, res) => {
    res.send('Hello clients');
});

app.get('/albums', async (req, res) => {
    try {
        if (!connection) {
            connection = await createConnection();
        }

        const [rows] = await connection.execute('SELECT * FROM Albums LIMIT 100');
        
        res.json(rows);
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).json({ message: 'Database Error', details: error.message });
    } finally {
        if (connection && !connection.destroyed) {
            await connection.end();
            connection = null;
        }
    }
});

app.post('/execute_qq', async (req, res) => {
    try {
        if (!connection) {
            connection = await createConnection();
        }
        const query = req.body.query;
        
        // Execute the query
        const [results] = await connection.execute(query);

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
        if (connection) {
            await connection.end();
            connection = null;
        }
    }
});

// Initialize database connection on app start
async function initDB() {
    try {
        connection = await createConnection();
        console.log('Database connection established successfully');
    } catch (err) {
        console.error('Failed to establish database connection:', err);
        process.exit(1);
    }
}

initDB();

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});