const mysql = require('mysql2/promise');

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kadesh',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });

    // Connection error handling
    this.testConnection();
  }

  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      console.log('✅ MySQL connected successfully');
      connection.release();
    } catch (err) {
      console.error('❌ MySQL connection failed:', err.message);
    }
  }

  async query(text, params) {
    const start = Date.now();
    try {
      // Converter placeholders $1, $2... para ? (MySQL style)
      let sqlQuery = text;
      if (params && params.length > 0) {
        params.forEach((_, index) => {
          sqlQuery = sqlQuery.replace(`$${index + 1}`, '?');
        });
      }
      
      const [rows] = await this.pool.execute(sqlQuery, params || []);
      const duration = Date.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Query executed:', {
          text: sqlQuery.substring(0, 100) + (sqlQuery.length > 100 ? '...' : ''),
          duration: `${duration}ms`,
          rows: Array.isArray(rows) ? rows.length : 0
        });
      }
      
      // Retornar no formato PostgreSQL para compatibilidade
      return {
        rows: Array.isArray(rows) ? rows : [rows],
        rowCount: Array.isArray(rows) ? rows.length : (rows.affectedRows || 0)
      };
    } catch (err) {
      console.error('❌ Database query error:', {
        query: text.substring(0, 100),
        error: err.message
      });
      throw err;
    }
  }

  async getClient() {
    return await this.pool.getConnection();
  }

  async transaction(callback) {
    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = new Database();
