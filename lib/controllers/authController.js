// ========================================
// STARWAVE - AUTHENTICATION CONTROLLER
// ========================================

const pool = require("../db");

const {
    hashPassword,
    comparePassword,
    createToken
} = require("../auth");

const {
    successResponse,
    errorResponse
} = require("../helpers/response");

const {
    isValidEmail,
    isValidPassword
} = require("../helpers/validation");


// ========================================
// REGISTER USER
// ========================================

async function registerUser(req, res) {

    try {

        const {
            name,
            email,
            password,
            phone,
            date_of_birth,
            gender,
            country
        } = req.body;


        if (!name || !email || !password) {

            return errorResponse(
                res,
                "Name, email and password are required.",
                400
            );

        }


        if (!isValidEmail(email)) {

            return errorResponse(
                res,
                "Please enter a valid email address.",
                400
            );

        }


        if (!isValidPassword(password)) {

            return errorResponse(
                res,
                "Password must be at least 6 characters.",
                400
            );

        }


        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );


        if (existingUser.rows.length > 0) {

            return errorResponse(
                res,
                "An account with this email already exists.",
                409
            );

        }


        const hashedPassword = await hashPassword(password);


        const result = await pool.query(
            `INSERT INTO users
            (name, email, password, phone, date_of_birth, gender, country)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, name, email, phone, date_of_birth, gender, country, role, created_at`,
            [
                name,
                email,
                hashedPassword,
                phone || null,
                date_of_birth || null,
                gender || null,
                country || null
            ]
        );


        const user = result.rows[0];

        const token = createToken(user);


        return successResponse(
            res,
            {
                user,
                token
            },
            "Account created successfully.",
            201
        );

    } catch (error) {

        console.error("Register error:", error);

        return errorResponse(
            res,
            "Unable to create account.",
            500
        );

    }
}


// ========================================
// LOGIN USER
// ========================================

async function loginUser(req, res) {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return errorResponse(
                res,
                "Email and password are required.",
                400
            );

        }


        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );


        if (result.rows.length === 0) {

            return errorResponse(
                res,
                "Invalid email or password.",
                401
            );

        }


        const user = result.rows[0];


        const passwordMatch = await comparePassword(
            password,
            user.password
        );


        if (!passwordMatch) {

            return errorResponse(
                res,
                "Invalid email or password.",
                401
            );

        }


        delete user.password;


        const token = createToken(user);


        return successResponse(
            res,
            {
                user,
                token
            },
            "Login successful."
        );

    } catch (error) {

        console.error("Login error:", error);

        return errorResponse(
            res,
            "Unable to login.",
            500
        );

    }
}


// ========================================
// GET CURRENT USER
// ========================================

async function getCurrentUser(req, res) {

    try {

        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                phone,
                date_of_birth,
                gender,
                country,
                profile_image,
                role,
                created_at
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );


        if (result.rows.length === 0) {

            return errorResponse(
                res,
                "User not found.",
                404
            );

        }


        return successResponse(
            res,
            result.rows[0],
            "User retrieved successfully."
        );

    } catch (error) {

        console.error("Get user error:", error);

        return errorResponse(
            res,
            "Unable to retrieve user.",
            500
        );

    }
}


// ========================================
// EXPORT
// ========================================

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
};