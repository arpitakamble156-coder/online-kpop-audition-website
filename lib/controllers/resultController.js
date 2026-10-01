// ========================================
// STARWAVE - RESULT CONTROLLER
// ========================================

const pool = require("../db");
const { successResponse, errorResponse } = require("../helpers/response");


// GET MY RESULTS
async function getMyResults(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                r.id,
                r.application_id,
                r.result,
                r.remarks,
                r.published_at,
                a.title AS audition_title
            FROM results r
            JOIN applications ap
                ON r.application_id = ap.id
            JOIN auditions a
                ON ap.audition_id = a.id
            WHERE ap.user_id = $1
            ORDER BY r.published_at DESC
        `, [req.user.id]);

        return successResponse(
            res,
            result.rows,
            "Results retrieved successfully."
        );

    } catch (error) {
        console.error("Get results error:", error);
        return errorResponse(res, "Unable to retrieve results.", 500);
    }
}


// GET RESULT BY ID
async function getResultById(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT
                r.*,
                a.title AS audition_title
            FROM results r
            JOIN applications ap
                ON r.application_id = ap.id
            JOIN auditions a
                ON ap.audition_id = a.id
            WHERE r.id = $1
            AND ap.user_id = $2
        `, [id, req.user.id]);

        if (result.rows.length === 0) {
            return errorResponse(res, "Result not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Result retrieved successfully."
        );

    } catch (error) {
        console.error("Get result error:", error);
        return errorResponse(res, "Unable to retrieve result.", 500);
    }
}


// CREATE RESULT
async function createResult(req, res) {
    try {
        const {
            application_id,
            result,
            remarks
        } = req.body;

        if (!application_id || !result) {
            return errorResponse(
                res,
                "Application ID and result are required.",
                400
            );
        }

        const created = await pool.query(
            `INSERT INTO results
             (application_id, result, remarks)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [
                application_id,
                result,
                remarks || null
            ]
        );

        return successResponse(
            res,
            created.rows[0],
            "Result created successfully.",
            201
        );

    } catch (error) {
        console.error("Create result error:", error);
        return errorResponse(res, "Unable to create result.", 500);
    }
}


// GET ALL RESULTS
async function getAllResults(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                r.*,
                u.name AS applicant_name,
                u.email AS applicant_email,
                a.title AS audition_title
            FROM results r
            JOIN applications ap
                ON r.application_id = ap.id
            JOIN users u
                ON ap.user_id = u.id
            JOIN auditions a
                ON ap.audition_id = a.id
            ORDER BY r.published_at DESC
        `);

        return successResponse(
            res,
            result.rows,
            "Results retrieved successfully."
        );

    } catch (error) {
        console.error("Get all results error:", error);
        return errorResponse(res, "Unable to retrieve results.", 500);
    }
}


module.exports = {
    getMyResults,
    getResultById,
    createResult,
    getAllResults
};