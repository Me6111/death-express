
app.get('/', (req, res) => {
    res.send('Hello from the root path!');
});

app.get('/hello', (req, res) => {
    res.send('Hello client');
});

app.get('/leprosytxt', (req, res) => {
    const filePath = path.join(__dirname, 'songs', '1 Leprosy.txt');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        res.type('text/plain').send(data);    
    });
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





app.get('/addsongrow', async (req, res) => {
    try {

        if (!connection) {
            connection = await createConnection();
        }

        const columnsValues = {
            Album: '2',
            ID: '3',
            Lyrics: 'xxx',
            Description: '',
        }

        await connection.execute();

        res.json({ message: 'Songs table row updated successfully' });
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
















  const axios = require('axios');

  async function getArtists(artistName) {
    try {
      const apiKey = process.env.MUSIXMATCH_API_KEY;
      const response = await axios.get(`https://api.musixmatch.com/ws/1.1/artist.search?q_artist=${encodeURIComponent(artistName)}&page_size=3&apikey=${apiKey}`);
  
      console.log('Raw response:', JSON.stringify(response.data, null, 2));
  
      if (!response.data || !response.data.message || !response.data.message.body || !response.data.message.body.artist_list) {
        const statusCode = response?.data?.message?.header?.status_code;
        const statusMsg = response?.data?.message?.header?.status_msg;
        throw new Error(`Invalid API response format (Status: ${statusCode}, Message: ${statusMsg})`);
      }
  
      const artists = response.data.message.body.artist_list;
      return artists;
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error; // Re-throw the error for Express.js handling
    }
  }
  
  // Express.js server setup (add this to your app.js file)
  const express = require('express');
  const app = express();
  
  app.use(express.json());
  
  app.get('/api/artists/:artistName', async (req, res) => {
    try {
      const artistName = req.params.artistName;
      if (!artistName) {
        return res.status(400).json({ error: 'Missing artist name' });
      }
      const artists = await getArtists(artistName);
      res.json(artists);
    } catch (error) {
      console.error('Error fetching artists:', error);
      res.status(statusCode || 500).json({ error: statusMsg || 'Failed to fetch artists' });
    }
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });