const bcrypt = require("bcrypt");
async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  console.log("Hashed Password:", hashedPassword);
  // Code to create admin user in the database
}
createAdmin();