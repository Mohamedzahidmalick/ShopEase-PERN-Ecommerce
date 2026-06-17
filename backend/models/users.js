const pool = require("../db");

const Usermodel = {
  create: async ({ name, location, email, password }) => {
    return pool.query(
      `INSERT INTO users (name, location, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email`,
      [name, location, email, password]
    );
  },

  findByEmail: async (email) => {
    return pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
  }
};

module.exports = Usermodel;
