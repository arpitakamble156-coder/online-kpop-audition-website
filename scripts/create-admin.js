// ========================================
// STARWAVE - CREATE ADMIN ACCOUNT
// ========================================

require("dotenv").config();

const pool = require("../lib/db");

const {
    hashPassword
} = require("../lib/auth");


async function createAdmin() {

    try {

        const name = "StarWave Admin";
        const email = "admin@starwave.com";
        const password = "Admin@123";


        const existingAdmin = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );


        if (existingAdmin.rows.length > 0) {

            console.log("Admin account already exists.");

            await pool.end();

            return;

        }


        const hashedPassword = await hashPassword(password);


        await pool.query(
            `INSERT INTO users
            (
                name,
                email,
                password,
                role
            )
            VALUES ($1, $2, $3, 'admin')`,
            [
                name,
                email,
                hashedPassword
            ]
        );


        console.log("Admin account created successfully.");
        console.log("Email:", email);
        console.log("Password:", password);


        await pool.end();

    } catch (error) {

        console.error(
            "Unable to create admin:",
            error.message
        );

        await pool.end();

        process.exit(1);
    }
}


createAdmin();