// ========================================
// STARWAVE - APPLICATION CONTROLLER
// ========================================

const pool = require("../db");

const {
    successResponse,
    errorResponse
} = require("../helpers/response");


// ========================================
// APPLY FOR AUDITION
// ========================================

async function createApplication(req, res) {

    try {

        const { audition_id } = req.body;
        const user_id = req.user.id;

        if (!audition_id) {

            return errorResponse(
                res,
                "Audition ID is required.",
                400
            );

        }

        const audition = await pool.query(
            "SELECT id FROM auditions WHERE id = $1 AND status = 'open'",
            [audition_id]
        );

        if (audition.rows.length === 0) {

            return errorResponse(
                res,
                "Audition is not available.",
                404
            );

        }

        const existingApplication = await pool.query(
            `SELECT id
             FROM applications
             WHERE user_id = $1
             AND audition_id = $2`,
            [user_id, audition_id]
        );

        if (existingApplication.rows.length > 0) {

            return errorResponse(
                res,
                "You have already applied for this audition.",
                409
            );

        }

        const result = await pool.query(
            `INSERT INTO applications
             (user_id, audition_id)
             VALUES ($1, $2)
             RETURNING *`,
            [user_id, audition_id]
        );

        return successResponse(
            res,
            result.rows[0],
            "Application submitted successfully.",
            201
        );

    } catch (error) {

        console.error("Create application error:", error);

        return errorResponse(
            res,
            "Unable to submit application.",
            500
        );

    }
}


// ========================================
// GET MY APPLICATIONS
// ========================================

async function getMyApplications(req, res) {

    try {

        const user_id = req.user.id;

        const result = await pool.query(`
            SELECT
                ap.id,
                ap.status,
                ap.applied_at,
                a.id AS audition_id,
                a.title AS audition_title,
                a.deadline,
                a.status AS audition_status,
                ag.name AS agency_name,
                c.name AS category_name
            FROM applications ap
            JOIN auditions a
                ON ap.audition_id = a.id
            LEFT JOIN agencies ag
                ON a.agency_id = ag.id
            LEFT JOIN categories c
                ON a.category_id = c.id
            WHERE ap.user_id = $1
            ORDER BY ap.applied_at DESC
        `, [user_id]);

        return successResponse(
            res,
            result.rows,
            "Applications retrieved successfully."
        );

    } catch (error) {

        console.error("Get applications error:", error);

        return errorResponse(
            res,
            "Unable to retrieve applications.",
            500
        );

    }
}


// ========================================
// GET APPLICATION BY ID
// ========================================

async function getApplicationById(req, res) {

    try {

        const { id } = req.params;
        const user_id = req.user.id;

        const result = await pool.query(`
            SELECT
                ap.id,
                ap.status,
                ap.applied_at,
                a.id AS audition_id,
                a.title AS audition_title,
                a.description AS audition_description,
                a.requirements,
                a.deadline,
                ag.name AS agency_name,
                c.name AS category_name
            FROM applications ap
            JOIN auditions a
                ON ap.audition_id = a.id
            LEFT JOIN agencies ag
                ON a.agency_id = ag.id
            LEFT JOIN categories c
                ON a.category_id = c.id
            WHERE ap.id = $1
            AND ap.user_id = $2
        `, [id, user_id]);

        if (result.rows.length === 0) {

            return errorResponse(
                res,
                "Application not found.",
                404
            );

        }

        return successResponse(
            res,
            result.rows[0],
            "Application retrieved successfully."
        );

    } catch (error) {

        console.error("Get application error:", error);

        return errorResponse(
            res,
            "Unable to retrieve application.",
            500
        );

    }
}


// ========================================
// UPDATE APPLICATION STATUS
// ========================================

async function updateApplicationStatus(req, res) {

    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!status) {

            return errorResponse(
                res,
                "Application status is required.",
                400
            );

        }

        const result = await pool.query(
            `UPDATE applications
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {

            return errorResponse(
                res,
                "Application not found.",
                404
            );

        }

        return successResponse(
            res,
            result.rows[0],
            "Application status updated successfully."
        );

    } catch (error) {

        console.error("Update application error:", error);

        return errorResponse(
            res,
            "Unable to update application.",
            500
        );

    }
}


// ========================================
// EXPORT
// ========================================

module.exports = {
    createApplication,
    getMyApplications,
    getApplicationById,
    updateApplicationStatus
};