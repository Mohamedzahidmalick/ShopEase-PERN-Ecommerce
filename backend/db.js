const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});


// Test DB immediately
pool.query("SELECT current_database()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log(
      "Database connected successfully:",
      res.rows[0].current_database
    );
  }
});


pool.on("error", (err) => {
  console.error("Unexpected DB error:", err.message);
});


module.exports = pool;
{/*const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", (err) => {
  console.error("Unexpected DB error", err.message);
  process.exit(1);
});

module.exports = pool;

pool.query("SELECT current_database()", (err, res) => {
  console.log("Connected DB", res.rows[0].current_database);
});


module.exports = pool;
*/}
