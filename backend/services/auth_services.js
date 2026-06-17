const pool = require("../db");
const bcrypt = require("bcrypt");

exports.signupService = async (
  first_name,
  last_name,
  email,
  phone_no,
  password,
  role
) => {

  const userExists = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (userExists.rows.length > 0) {
    throw new Error("Email exists");
  }

  const hashed = await bcrypt.hash(
    password,
    10
  );

  await pool.query(
    `
    INSERT INTO users
    (first_name,last_name,email,phone_no,password,role)
    VALUES ($1,$2,$3,$4,$5,$6)
    `,
    [
      first_name,
      last_name,
      email,
      phone_no,
      hashed,
      role,
    ]
  );

};



exports.loginService = async (
  email,
  password
) => {

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(
    password,
    user.password
  );

  if (!match) {
    throw new Error("Wrong password");
  }

  return user;

};