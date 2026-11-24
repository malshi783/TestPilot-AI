require("dotenv").config();
const fs = require("node:fs/promises");
const path = require("node:path");
const pool = require("../config/database");

async function main() {
  const schemaPath = path.resolve(__dirname, "../../../database/schema.sql");
  const schema = (await fs.readFile(schemaPath, "utf8")).replace(/^\uFEFF/, "");

  await pool.query(schema);
  console.log("Database schema is ready.");
}

main()
  .catch((error) => {
    console.error("Database setup failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
