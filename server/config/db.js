require('dotenv').config(); // Load environment variables

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL});

pool.connect()
    .then(() => console.log("DB Connected ✅"))
    .catch(err => console.error("Connection error ❌", err));

module.exports = pool;
