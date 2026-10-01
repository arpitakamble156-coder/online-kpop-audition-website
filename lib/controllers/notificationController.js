// ========================================
// STARWAVE - NOTIFICATION CONTROLLER
// ========================================

const pool = require("../db");
const { successResponse, errorResponse } = require("../helpers/response");


// GET MY NOTIFICATIONS
async function getMyNotifications(req, res) {
    try {
        const result = await pool.query(
            `SELECT *
             FROM notifications
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        return successResponse(
            res,
            result.rows,
            "Notifications retrieved successfully."
        );

    } catch (error) {
        console.error("Get notifications error:", error);
        return errorResponse(res, "Unable to retrieve notifications.", 500);
    }
}


// MARK AS READ
async function markAsRead(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "Notification not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Notification marked as read."
        );

    } catch (error) {
        console.error("Mark notification error:", error);
        return errorResponse(res, "Unable to update notification.", 500);
    }
}


// CREATE NOTIFICATION
async function createNotification(req, res) {
    try {
        const {
            user_id,
            title,
            message
        } = req.body;

        if (!user_id || !title || !message) {
            return errorResponse(
                res,
                "User ID, title and message are required.",
                400
            );
        }

        const result = await pool.query(
            `INSERT INTO notifications
             (user_id, title, message)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [user_id, title, message]
        );

        return successResponse(
            res,
            result.rows[0],
            "Notification created successfully.",
            201
        );

    } catch (error) {
        console.error("Create notification error:", error);
        return errorResponse(res, "Unable to create notification.", 500);
    }
}


module.exports = {
    getMyNotifications,
    markAsRead,
    createNotification
};