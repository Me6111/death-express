// C:\Users\user\Desktop\projects\death-express\app.js

const express = require('express');
const cors = require('cors');
const TablesInfoService = require('./tablesInfo'); // Ensure this path is correct
const app = express();
const db = require('./db');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const tablesInfoService = new TablesInfoService(process.env.DATABASE_URL);





// Root path route
app.get('/', (req, res) => {
  res.send('Hello from the root path!');
});






// Hello route
app.get('/hello', (req, res) => {
  res.send('Hello client');
});






// Tables-info route
app.get('/tables-info', async (req, res) => {
  try {
    const tablesInfo = await tablesInfoService.fetchTablesAndColumns();
    // Directly send the structured data obtained from fetchTablesAndColumns
    res.json(tablesInfo);
  } catch (error) {
    console.error('Error fetching tables and columns:', error);
    res.status(500).send('Internal Server Error');
  }
});







// Corrected '/get_borders' endpoint
app.post('/get_borders', async (req, res) => {
  try {
    console.log(`Full received data from client: ${JSON.stringify(req.body)}`, typeof req.body);
    console.log('--------------------------------------------------------------------------');
    const adm_units = ['country', 'state', 'city', 'zip'];
    const adm_unit = adm_units[req.body.adm_unit];
    const where_adm_unit = adm_units[req.body.where_adm_unit];
    const location = req.body.full_loc;
    const where_loc = location[req.body.where_adm_unit];
    let get_borders_qq;
    let where_loc_borders_qq;
    let borders = null;
    let where_loc_borders = null;
    if (JSON.stringify(location) === JSON.stringify([null, null, null, null])) {
      get_borders_qq = 'SELECT country, cleaned_geojson FROM country';
    } else {
      get_borders_qq = `
        SELECT ${adm_unit}, cleaned_geojson 
        FROM ${adm_unit} 
        WHERE ${where_adm_unit}_id = (
          SELECT ${where_adm_unit}_id 
          FROM ${where_adm_unit} 
          WHERE ${where_adm_unit} = '${where_loc}'
        )
      `;
      where_loc_borders_qq = `
        SELECT ${where_adm_unit}_id, ${where_adm_unit}, cleaned_geojson 
        FROM ${where_adm_unit} 
        WHERE ${where_adm_unit} = '${where_loc}'
      `;
      where_loc_borders = await execute_qq(where_loc_borders_qq);
    }
    borders = await execute_qq(get_borders_qq);
    res.send({'where_loc_borders': where_loc_borders,'borders': borders});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error occurred');
  }
});






async function execute_qq(qq) {
  console.log('execute_qq - qq:', qq);
  try {
    const result = await db.query(qq);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
};

app.post('/receive_and_send_response', async (req, res) => {
  try {
    if (req.body && typeof req.body === 'object') {
      console.log('----------------------------------------------')
      console.log('Received data from client:', req.body);

      const adm_units = ['country', 'state', 'city', 'zip'];

      let adm_unit_locs_borders_qq;
      let where_loc_borders_qq;

      let adm_unit_locs_borders;
      let where_loc_borders;

      var adm_unit_idx = req.body['adm_unit'];
      var full_loc = req.body['full_loc'];

      adm_unit = adm_units[adm_unit_idx];
      

      
      var where_adm_unit = null;
      var where_loc = null;



      if ((req.body.full_loc.every(item => item === ''))) {
        adm_unit_locs_borders_qq = 'SELECT country, cleaned_geojson FROM country';
      } else {
        where_adm_unit = adm_units[adm_unit_idx - 1];
        where_loc = full_loc[adm_unit_idx - 1];

        adm_unit_locs_borders_qq = `
          SELECT ${adm_unit}, cleaned_geojson 
          FROM ${adm_unit} 
          WHERE ${where_adm_unit}_id = (
            SELECT ${where_adm_unit}_id 
            FROM ${where_adm_unit} 
            WHERE ${where_adm_unit} = '${where_loc}'
          )
        `;
        where_loc_borders_qq = `
          SELECT ${where_adm_unit}_id, ${where_adm_unit}, cleaned_geojson 
          FROM ${where_adm_unit} 
          WHERE ${where_adm_unit} = '${where_loc}'
        `;
        where_loc_borders = await execute_qq(where_loc_borders_qq);
      }
      adm_unit_locs_borders = await execute_qq(adm_unit_locs_borders_qq);
      var response = {'where_loc_borders': where_loc_borders,'adm_unit_locs_borders': adm_unit_locs_borders};
      console.log('receive_and_send_response - response:', response);
      res.send(response);




    } else {
      console.log('No data received or data format is incorrect.');
      res.status(400).send({ message: 'No data received or data format is incorrect.' });
    }
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).send({ message: 'An error occurred while processing your request.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});









