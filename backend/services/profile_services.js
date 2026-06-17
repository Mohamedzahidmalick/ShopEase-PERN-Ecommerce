const pool = require("../db");

exports.updateUserProfileService = async (
  user_id,
  name,
  phone_no,
  imagePath
) => {

  const parts = name.trim().split(" ");

  const first_name = parts[0];

  const last_name =
    parts.length > 1
      ? parts.slice(1).join(" ")
      : parts[0];

  if (imagePath) {

    await pool.query(
      `
      UPDATE users
      SET first_name=$1,
          last_name=$2,
          phone_no=$3,
          image=$4
      WHERE id=$5
      `,
      [
        first_name,
        last_name,
        phone_no,
        imagePath,
        user_id,
      ]
    );

  } else {

    await pool.query(
      `
      UPDATE users
      SET first_name=$1,
          last_name=$2,
          phone_no=$3
      WHERE id=$4
      `,
      [
        first_name,
        last_name,
        phone_no,
        user_id,
      ]
    );

  }

  const result = await pool.query(
    `
    SELECT
      id,
      first_name || ' ' || last_name AS name,
      email,
      phone_no,
      image,
      role
    FROM users
    WHERE id=$1
    `,
    [user_id]
  );

  return result.rows[0];

};



exports.updateAdminProfileService = async (
  admin_id,
  name,
  phone_no,
  imagePath
) => {

  if (imagePath) {

    await pool.query(
      `
      UPDATE admins
      SET name=$1,
          phone_no=$2,
          image=$3
      WHERE id=$4
      `,
      [
        name,
        phone_no,
        imagePath,
        admin_id,
      ]
    );

  } else {

    await pool.query(
      `
      UPDATE admins
      SET name=$1,
          phone_no=$2
      WHERE id=$3
      `,
      [
        name,
        phone_no,
        admin_id,
      ]
    );

  }

  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      phone_no,
      image
    FROM admins
    WHERE id=$1
    `,
    [admin_id]
  );

  return result.rows[0];

};