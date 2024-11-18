// db.js
const mysql = require('mysql2/promise');

async function createConnection() {
    return await mysql.createConnection({
        host: process.env.DB_HOST || 'mysql.railway.internal',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'AaBUkersWTTvBHxHEPbLhWkaJuzhbTUM',
        database: process.env.DB_NAME || 'railway',
        port: process.env.DB_PORT || 3306,
    });
}

async function execute_qq(query) {
    let connection;
    try {
        if (!connection) {
            connection = await createConnection();
        }
        
        const [results] = await connection.execute(query);
        return results;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

module.exports = { createConnection, execute_qq };