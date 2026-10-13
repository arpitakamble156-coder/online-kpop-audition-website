// ========================================
// STARWAVE - PROFILE CONTROLLER
// ========================================

const pool = require("../db");
const { successResponse, errorResponse } = require("../helpers/response");


// GET PROFILE
async function getProfile(req, res) {
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
            return errorResponse(res, "Profile not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Profile retrieved successfully."
        );

    } catch (error) {
        console.error("Get profile error:", error);
        return errorResponse(res, "Unable to retrieve profile.", 500);
    }
}


// UPDATE PROFILE
async function updateProfile(req, res) {
    try {
        const {
            name,
            phone,
            date_of_birth,
            gender,
            country,
            profile_image
        } = req.body;

        const result = await pool.query(
            `UPDATE users
             SET
                name = COALESCE($1, name),
                phone = COALESCE($2, phone),
                date_of_birth = COALESCE($3, date_of_birth),
                gender = COALESCE($4, gender),
                country = COALESCE($5, country),
                profile_image = COALESCE($6, profile_image)
             WHERE id = $7
             RETURNING
                id,
                name,
                email,
                phone,
                date_of_birth,
                gender,
                country,
                profile_image,
                role,
                created_at`,
            [
                name,
                phone,
                date_of_birth,
                gender,
                country,
                profile_image,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "Profile not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Profile updated successfully."
        );

    } catch (error) {
        console.error("Update profile error:", error);
        return errorResponse(res, "Unable to update profile.", 500);
    }
}


module.exports = {
    getProfile,
    updateProfile
};