const mysql = require('mysql2/promise');

// Use the DATABASE_URL environment variable directly
const connectionString = process.env.DATABASE_URL || 'mysql://root:AaBUkersWTTvBHxHEPbLhWkaJuzhbTUM@mysql.railway.internal:3306/railway';

class TablesInfoService {
  constructor() {
    this.connection = mysql.createConnection(connectionString);
  }

  async getAllTableNames() {
    const query = 'SHOW TABLES';
    try {
      const [rows] = await this.connection.execute(query);
      const tables = rows.map(row => row.Tables_in_[0]);
      console.log('Tables fetched:', tables);
      return tables;
    } catch (error) {
      console.error('Error fetching all table names:', error);
      throw error;
    }
  }

  async getColumnDetails(tableName) {
    const query = 'DESCRIBE ?';
    try {
      const [rows] = await this.connection.execute(query, [tableName]);
      const columns = rows.map(column => ({
        column_name: column.Field,
        data_type: column.Type,
      }));
      console.log(`Columns fetched for ${tableName}:`, columns);
      return columns;
    } catch (error) {
      console.error(`Error fetching columns for table ${tableName}:`, error);
      throw error;
    }
  }

  async fetchTablesAndColumns() {
    try {
      console.log('Fetching tables and columns...');
      const tablesResult = await this.getAllTableNames();
      const tables = tablesResult;

      const tablesInfo = await Promise.all(
        tables.map(async (tableName) => {
          console.log(`Fetching columns for table: ${tableName}`);
          const columnsResult = await this.getColumnDetails(tableName);
          return { tableName, columns: columnsResult };
        })
      );

      console.log('All tables and columns fetched successfully.');
      return tablesInfo;
    } catch (error) {
      console.error('Error fetching tables and columns:', error);
      throw error;
    }
  }
}

module.exports = TablesInfoService;