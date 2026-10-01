// ========================================
// STARWAVE - DATABASE CONNECTION
// ========================================

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL database");
});

pool.on("error", (error) => {
    console.error("Database error:", error);
});

module.exports = pool;