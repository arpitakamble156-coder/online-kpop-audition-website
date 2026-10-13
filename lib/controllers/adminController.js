// ========================================
// STARWAVE - ADMIN CONTROLLER
// ========================================

const pool = require("../db");
const { successResponse, errorResponse } = require("../helpers/response");


// DASHBOARD STATISTICS
async function getDashboardStats(req, res) {
    try {

        const users = await pool.query(
            "SELECT COUNT(*) FROM users WHERE role = 'user'"
        );

        const auditions = await pool.query(
            "SELECT COUNT(*) FROM auditions"
        );

        const applications = await pool.query(
            "SELECT COUNT(*) FROM applications"
        );

        const submissions = await pool.query(
            "SELECT COUNT(*) FROM submissions"
        );

        const judges = await pool.query(
            "SELECT COUNT(*) FROM judges"
        );

        return successResponse(
            res,
            {
                users: Number(users.rows[0].count),
                auditions: Number(auditions.rows[0].count),
                applications: Number(applications.rows[0].count),
                submissions: Number(submissions.rows[0].count),
                judges: Number(judges.rows[0].count)
            },
            "Dashboard statistics retrieved successfully."
        );

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return errorResponse(
            res,
            "Unable to retrieve dashboard statistics.",
            500
        );
    }
}


// GET ALL USERS
async function getUsers(req, res) {
    try {
        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                phone,
                country,
                role,
                created_at
             FROM users
             ORDER BY created_at DESC`
        );

        return successResponse(
            res,
            result.rows,
            "Users retrieved successfully."
        );

    } catch (error) {
        console.error("Get users error:", error);
        return errorResponse(res, "Unable to retrieve users.", 500);
    }
}


// DELETE USER
async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM users
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "User not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "User deleted successfully."
        );

    } catch (error) {
        console.error("Delete user error:", error);
        return errorResponse(res, "Unable to delete user.", 500);
    }
}


module.exports = {
    getDashboardStats,
    getUsers,
    deleteUser
};