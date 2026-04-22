
const { Pool } = require("pg");

class DatabaseHandler {
  async getPool() {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async setupDatabase() {
    const pool = await this.getPool();
    await pool.query(`
    CREATE TABLE IF NOT EXISTS transacoes (
      id SERIAL PRIMARY KEY,
      usuario VARCHAR(100) NOT NULL,
      valor NUMERIC(10,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pendente',
      criado_em TIMESTAMP DEFAULT NOW()
    )
  `);
    console.log("Tabela de transações pronta!");
  }
}

module.exports = new DatabaseHandler();
