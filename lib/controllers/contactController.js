// ========================================
// STARWAVE - CONTACT CONTROLLER
// ========================================

const pool = require("../db");
const { successResponse, errorResponse } = require("../helpers/response");


// SEND CONTACT MESSAGE
async function createContactMessage(req, res) {
    try {
        const {
            name,
            email,
            subject,
            message
        } = req.body;

        if (!name || !email || !message) {
            return errorResponse(
                res,
                "Name, email and message are required.",
                400
            );
        }

        const result = await pool.query(
            `INSERT INTO contact_messages
             (name, email, subject, message)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                name,
                email,
                subject || null,
                message
            ]
        );

        return successResponse(
            res,
            result.rows[0],
            "Your message has been sent successfully.",
            201
        );

    } catch (error) {
        console.error("Contact message error:", error);
        return errorResponse(
            res,
            "Unable to send your message.",
            500
        );
    }
}


// GET CONTACT MESSAGES
async function getContactMessages(req, res) {
    try {
        const result = await pool.query(
            `SELECT *
             FROM contact_messages
             ORDER BY created_at DESC`
        );

        return successResponse(
            res,
            result.rows,
            "Contact messages retrieved successfully."
        );

    } catch (error) {
        console.error("Get contact messages error:", error);
        return errorResponse(
            res,
            "Unable to retrieve contact messages.",
            500
        );
    }
}


module.exports = {
    createContactMessage,
    getContactMessages
};