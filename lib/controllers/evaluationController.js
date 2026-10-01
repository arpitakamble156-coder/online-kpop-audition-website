// ========================================
// STARWAVE - EVALUATION CONTROLLER
// ========================================

const pool = require("../db");
const { successResponse, errorResponse } = require("../helpers/response");


// CREATE EVALUATION
async function createEvaluation(req, res) {
    try {
        const {
            submission_id,
            score,
            comments
        } = req.body;

        const judgeResult = await pool.query(
            `SELECT id
             FROM judges
             WHERE user_id = $1`,
            [req.user.id]
        );

        if (judgeResult.rows.length === 0) {
            return errorResponse(res, "Judge account not found.", 403);
        }

        const judge_id = judgeResult.rows[0].id;

        if (!submission_id || score === undefined) {
            return errorResponse(
                res,
                "Submission ID and score are required.",
                400
            );
        }

        if (score < 0 || score > 100) {
            return errorResponse(
                res,
                "Score must be between 0 and 100.",
                400
            );
        }

        const result = await pool.query(
            `INSERT INTO evaluations
             (submission_id, judge_id, score, comments)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                submission_id,
                judge_id,
                score,
                comments || null
            ]
        );

        return successResponse(
            res,
            result.rows[0],
            "Evaluation saved successfully.",
            201
        );

    } catch (error) {
        console.error("Create evaluation error:", error);
        return errorResponse(res, "Unable to save evaluation.", 500);
    }
}


// GET EVALUATIONS
async function getEvaluations(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                e.id,
                e.submission_id,
                e.judge_id,
                e.score,
                e.comments,
                e.evaluated_at,
                u.name AS judge_name
            FROM evaluations e
            JOIN judges j
                ON e.judge_id = j.id
            JOIN users u
                ON j.user_id = u.id
            ORDER BY e.evaluated_at DESC
        `);

        return successResponse(
            res,
            result.rows,
            "Evaluations retrieved successfully."
        );

    } catch (error) {
        console.error("Get evaluations error:", error);
        return errorResponse(res, "Unable to retrieve evaluations.", 500);
    }
}


// GET MY EVALUATIONS
async function getMyEvaluations(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                e.id,
                e.submission_id,
                e.score,
                e.comments,
                e.evaluated_at,
                u.name AS judge_name
            FROM evaluations e
            JOIN judges j
                ON e.judge_id = j.id
            JOIN users u
                ON j.user_id = u.id
            JOIN submissions s
                ON e.submission_id = s.id
            JOIN applications ap
                ON s.application_id = ap.id
            WHERE ap.user_id = $1
            ORDER BY e.evaluated_at DESC
        `, [req.user.id]);

        return successResponse(
            res,
            result.rows,
            "Your evaluations retrieved successfully."
        );

    } catch (error) {
        console.error("Get my evaluations error:", error);
        return errorResponse(res, "Unable to retrieve evaluations.", 500);
    }
}


module.exports = {
    createEvaluation,
    getEvaluations,
    getMyEvaluations
};