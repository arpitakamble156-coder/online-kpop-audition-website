// ========================================
// STARWAVE - SUBMISSION CONTROLLER
// ========================================

const pool = require("../db");
const { successResponse, errorResponse } = require("../helpers/response");


// CREATE SUBMISSION
async function createSubmission(req, res) {
    try {
        const { application_id, submission_type, file_url, description } = req.body;

        if (!application_id || !file_url) {
            return errorResponse(
                res,
                "Application ID and file URL are required.",
                400
            );
        }

        const application = await pool.query(
            `SELECT id FROM applications
             WHERE id = $1 AND user_id = $2`,
            [application_id, req.user.id]
        );

        if (application.rows.length === 0) {
            return errorResponse(res, "Application not found.", 404);
        }

        const result = await pool.query(
            `INSERT INTO submissions
             (application_id, submission_type, file_url, description)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                application_id,
                submission_type || "video",
                file_url,
                description || null
            ]
        );

        return successResponse(
            res,
            result.rows[0],
            "Submission uploaded successfully.",
            201
        );

    } catch (error) {
        console.error("Create submission error:", error);
        return errorResponse(res, "Unable to create submission.", 500);
    }
}


// GET MY SUBMISSIONS
async function getMySubmissions(req, res) {
    try {
        const result = await pool.query(
            `SELECT
                s.id,
                s.application_id,
                s.submission_type,
                s.file_url,
                s.description,
                s.submitted_at,
                a.title AS audition_title
             FROM submissions s
             JOIN applications ap
                ON s.application_id = ap.id
             JOIN auditions a
                ON ap.audition_id = a.id
             WHERE ap.user_id = $1
             ORDER BY s.submitted_at DESC`,
            [req.user.id]
        );

        return successResponse(
            res,
            result.rows,
            "Submissions retrieved successfully."
        );

    } catch (error) {
        console.error("Get submissions error:", error);
        return errorResponse(res, "Unable to retrieve submissions.", 500);
    }
}


// GET SUBMISSION BY ID
async function getSubmissionById(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                s.*,
                ap.user_id,
                a.title AS audition_title
             FROM submissions s
             JOIN applications ap
                ON s.application_id = ap.id
             JOIN auditions a
                ON ap.audition_id = a.id
             WHERE s.id = $1
             AND ap.user_id = $2`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "Submission not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Submission retrieved successfully."
        );

    } catch (error) {
        console.error("Get submission error:", error);
        return errorResponse(res, "Unable to retrieve submission.", 500);
    }
}


module.exports = {
    createSubmission,
    getMySubmissions,
    getSubmissionById
};