// ========================================
// STARWAVE - JUDGE CONTROLLER
// ========================================

const pool = require("../db");
const { successResponse, errorResponse } = require("../helpers/response");


// GET JUDGES
async function getJudges(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                j.id,
                j.user_id,
                j.agency_id,
                j.created_at,
                u.name,
                u.email,
                ag.name AS agency_name
            FROM judges j
            JOIN users u
                ON j.user_id = u.id
            LEFT JOIN agencies ag
                ON j.agency_id = ag.id
            ORDER BY j.created_at DESC
        `);

        return successResponse(
            res,
            result.rows,
            "Judges retrieved successfully."
        );

    } catch (error) {
        console.error("Get judges error:", error);
        return errorResponse(res, "Unable to retrieve judges.", 500);
    }
}


// GET JUDGE BY ID
async function getJudgeById(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT
                j.id,
                j.user_id,
                j.agency_id,
                j.created_at,
                u.name,
                u.email,
                ag.name AS agency_name
            FROM judges j
            JOIN users u
                ON j.user_id = u.id
            LEFT JOIN agencies ag
                ON j.agency_id = ag.id
            WHERE j.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return errorResponse(res, "Judge not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Judge retrieved successfully."
        );

    } catch (error) {
        console.error("Get judge error:", error);
        return errorResponse(res, "Unable to retrieve judge.", 500);
    }
}


// CREATE JUDGE
async function createJudge(req, res) {
    try {
        const {
            user_id,
            agency_id
        } = req.body;

        if (!user_id) {
            return errorResponse(res, "User ID is required.", 400);
        }

        const result = await pool.query(
            `INSERT INTO judges
             (user_id, agency_id)
             VALUES ($1, $2)
             RETURNING *`,
            [user_id, agency_id || null]
        );

        return successResponse(
            res,
            result.rows[0],
            "Judge created successfully.",
            201
        );

    } catch (error) {
        console.error("Create judge error:", error);
        return errorResponse(res, "Unable to create judge.", 500);
    }
}


// DELETE JUDGE
async function deleteJudge(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM judges
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "Judge not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Judge deleted successfully."
        );

    } catch (error) {
        console.error("Delete judge error:", error);
        return errorResponse(res, "Unable to delete judge.", 500);
    }
}


module.exports = {
    getJudges,
    getJudgeById,
    createJudge,
    deleteJudge
};