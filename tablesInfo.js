const { Pool } = require('pg');

class TablesInfoService {
  constructor(connectionString) {
    this.pool = new Pool({
      connectionString: connectionString,
    });
  }

  async getAllTableNames() {
    const query = `
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname != 'information_schema' 
      AND tablename !~ '^pg_';
    `;
    try {
      const result = await this.pool.query(query);
      console.log('Tables fetched:', result.rows.map(row => row.tablename));
      return result;
    } catch (error) {
      console.error('Error fetching all table names:', error);
      throw error;
    }
  }

  async getColumnDetails(tableName) {
    const query = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1;
    `;
    try {
      const result = await this.pool.query(query, [tableName]);
      console.log(`Columns fetched for ${tableName}:`, result.rows);
      return result;
    } catch (error) {
      console.error(`Error fetching columns for table ${tableName}:`, error);
      throw error;
    }
  }

  async fetchTablesAndColumns() {
    try {
      console.log('Fetching tables and columns...');
      const tablesResult = await this.getAllTableNames();
      const tables = tablesResult.rows.map(row => row.tablename);

      const tablesInfo = await Promise.all(
        tables.map(async (tableName) => {
          console.log(`Fetching columns for table: ${tableName}`);
          const columnsResult = await this.getColumnDetails(tableName);
          const columns = columnsResult.rows.reduce((acc, curr) => {
            acc[curr.column_name] = curr.data_type;
            return acc;
          }, {});
          console.log(`Columns fetched for ${tableName}:`, columns);
          return { tableName, columns };
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