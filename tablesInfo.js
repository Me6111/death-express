// C:\Users\user\Desktop\projects\death-express\tablesInfo.js

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
      WHERE schemaname!= 'information_schema' 
      AND tablename!~ '^pg_'`;
    return await this.pool.query(query);
  }

  async getColumnDetails(tableName) {
    const query = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1`;
    return await this.pool.query(query, [tableName]);
  }

  async fetchTablesAndColumns() {
    try {
      const tablesResult = await this.getAllTableNames();
      const tables = tablesResult.rows.map(row => row.tablename);

      const tablesInfo = await Promise.all(
        tables.map(async tableName => {
          const columnsResult = await this.getColumnDetails(tableName);
          const columns = columnsResult.rows.reduce((acc, curr) => {
            acc[curr.column_name] = curr.data_type;
            return acc;
          }, {});
          return { tableName, columns };
        })
      );

      return tablesInfo;
    } catch (error) {
      console.error('Error fetching tables and columns:', error);
      throw error;
    }
  }
}

module.exports = TablesInfoService;