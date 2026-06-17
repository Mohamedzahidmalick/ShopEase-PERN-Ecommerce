const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

async function addColumn() {
  try {
    await pool.query("ALTER TABLE cart ADD COLUMN IF NOT EXISTS is_saved_for_later BOOLEAN DEFAULT false;");
    console.log("Column added successfully");
  } catch (error) {
    console.error("Error adding column:", error);
  } finally {
    await pool.end();
  }
}

addColumn();