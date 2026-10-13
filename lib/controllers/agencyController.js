// ========================================
// STARWAVE - AGENCY CONTROLLER
// ========================================

const pool = require("../db");
const { successResponse, errorResponse } = require("../helpers/response");


// GET ALL AGENCIES
async function getAgencies(req, res) {
    try {
        const result = await pool.query(
            `SELECT *
             FROM agencies
             ORDER BY name ASC`
        );

        return successResponse(
            res,
            result.rows,
            "Agencies retrieved successfully."
        );

    } catch (error) {
        console.error("Get agencies error:", error);
        return errorResponse(res, "Unable to retrieve agencies.", 500);
    }
}


// GET AGENCY BY ID
async function getAgencyById(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM agencies
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "Agency not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Agency retrieved successfully."
        );

    } catch (error) {
        console.error("Get agency error:", error);
        return errorResponse(res, "Unable to retrieve agency.", 500);
    }
}


// CREATE AGENCY
async function createAgency(req, res) {
    try {
        const {
            name,
            description,
            logo,
            website
        } = req.body;

        if (!name) {
            return errorResponse(res, "Agency name is required.", 400);
        }

        const result = await pool.query(
            `INSERT INTO agencies
             (name, description, logo, website)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                name,
                description || null,
                logo || null,
                website || null
            ]
        );

        return successResponse(
            res,
            result.rows[0],
            "Agency created successfully.",
            201
        );

    } catch (error) {
        console.error("Create agency error:", error);
        return errorResponse(res, "Unable to create agency.", 500);
    }
}


// UPDATE AGENCY
async function updateAgency(req, res) {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            logo,
            website
        } = req.body;

        const result = await pool.query(
            `UPDATE agencies
             SET
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                logo = COALESCE($3, logo),
                website = COALESCE($4, website)
             WHERE id = $5
             RETURNING *`,
            [
                name,
                description,
                logo,
                website,
                id
            ]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "Agency not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Agency updated successfully."
        );

    } catch (error) {
        console.error("Update agency error:", error);
        return errorResponse(res, "Unable to update agency.", 500);
    }
}


// DELETE AGENCY
async function deleteAgency(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM agencies
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "Agency not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Agency deleted successfully."
        );

    } catch (error) {
        console.error("Delete agency error:", error);
        return errorResponse(res, "Unable to delete agency.", 500);
    }
}


module.exports = {
    getAgencies,
    getAgencyById,
    createAgency,
    updateAgency,
    deleteAgency
};