const express = require('express');
const cors = require('cors');
const { createConnection } = require('./db');
const fs = require('fs');

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
    res.send('Hello client');
});

app.get('/leprosytxt', (req, res) => {
  const data = fs.readFileSync('Leprosy.txt', 'utf8');
  res.type('text/plain').send(data);
});


app.get('/printlistoffilesfromsongsfolder', async (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');

        const songsDir = path.join(__dirname, 'songs');

        if (!connection) {
            connection = await createConnection();
        }

        let Album = 2;
        let fileNumbers = [];
        let allFiles = [];
        let filesInDatabase = [];
        let filesNotInDatabase = [];

        fs.readdirSync(songsDir).forEach(file => {
            const number = file.split(' ')[0];
            const name = file.split(' ').slice(1).join(' ');
            fileNumbers.push(number);
            allFiles.push(file);

            // Execute the query
            connection.execute('SELECT * FROM Songs WHERE Album = ? AND ID = ?', [Album, number])
                .then(([rows]) => {
                    if (rows.length > 0) {
                        filesInDatabase.push(file);
                    } else {
                        filesNotInDatabase.push(file);
                    }
                })
                .catch(error => {
                    console.error('Error checking database:', error);
                });
        });

        // Wait for all database queries to complete
        await Promise.allSettled(promises);

        res.json({
            fileNumbers,
            allFiles,
            filesInDatabase,
            filesNotInDatabase
        });
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).json({ message: 'Failed to list files' });
    } finally {
        if (connection && !connection.destroyed) {
            await connection.end();
            connection = null;
        }
    }
});

app.get('/insertlyricsfromtxt', async (req, res) => {
    try {
        const data = fs.readFileSync('Leprosy.txt', 'utf8');

        if (!connection) {
            connection = await createConnection();
        }

        await connection.execute('UPDATE Songs SET Lyrics = ? WHERE Album = 2 AND ID = 1', [data]);

        res.json({ message: 'Lyrics updated successfully' });
    } catch (error) {
        console.error('Error updating lyrics:', error);
        res.status(500).json({ message: 'Error updating lyrics', details: error.message });
    } finally {
        if (connection && !connection.destroyed) {
            await connection.end();
            connection = null;
        }
    }
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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});