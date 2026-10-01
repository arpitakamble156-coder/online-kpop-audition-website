// ========================================
// STARWAVE - AUDITION CONTROLLER
// ========================================

const pool = require("../db");

const {
    successResponse,
    errorResponse
} = require("../helpers/response");


// ========================================
// GET ALL AUDITIONS
// ========================================

async function getAuditions(req, res) {

    try {

        const result = await pool.query(`
            SELECT
                a.id,
                a.title,
                a.description,
                a.requirements,
                a.deadline,
                a.status,
                a.image,
                a.created_at,
                ag.name AS agency_name,
                c.name AS category_name
            FROM auditions a
            LEFT JOIN agencies ag
                ON a.agency_id = ag.id
            LEFT JOIN categories c
                ON a.category_id = c.id
            ORDER BY a.created_at DESC
        `);

        return successResponse(
            res,
            result.rows,
            "Auditions retrieved successfully."
        );

    } catch (error) {

        console.error("Get auditions error:", error);

        return errorResponse(
            res,
            "Unable to retrieve auditions.",
            500
        );

    }
}


// ========================================
// GET SINGLE AUDITION
// ========================================

async function getAuditionById(req, res) {

    try {

        const { id } = req.params;

        const result = await pool.query(`
            SELECT
                a.id,
                a.title,
                a.description,
                a.requirements,
                a.deadline,
                a.status,
                a.image,
                a.created_at,
                ag.name AS agency_name,
                c.name AS category_name
            FROM auditions a
            LEFT JOIN agencies ag
                ON a.agency_id = ag.id
            LEFT JOIN categories c
                ON a.category_id = c.id
            WHERE a.id = $1
        `, [id]);


        if (result.rows.length === 0) {

            return errorResponse(
                res,
                "Audition not found.",
                404
            );

        }


        return successResponse(
            res,
            result.rows[0],
            "Audition retrieved successfully."
        );

    } catch (error) {

        console.error("Get audition error:", error);

        return errorResponse(
            res,
            "Unable to retrieve audition.",
            500
        );

    }
}


// ========================================
// CREATE AUDITION
// ========================================

async function createAudition(req, res) {

    try {

        const {
            title,
            description,
            agency_id,
            category_id,
            requirements,
            deadline,
            status,
            image
        } = req.body;


        if (!title) {

            return errorResponse(
                res,
                "Audition title is required.",
                400
            );

        }


        const result = await pool.query(`
            INSERT INTO auditions
            (
                title,
                description,
                agency_id,
                category_id,
                requirements,
                deadline,
                status,
                image
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [
            title,
            description || null,
            agency_id || null,
            category_id || null,
            requirements || null,
            deadline || null,
            status || "open",
            image || null
        ]);


        return successResponse(
            res,
            result.rows[0],
            "Audition created successfully.",
            201
        );

    } catch (error) {

        console.error("Create audition error:", error);

        return errorResponse(
            res,
            "Unable to create audition.",
            500
        );

    }
}


// ========================================
// UPDATE AUDITION
// ========================================

async function updateAudition(req, res) {

    try {

        const { id } = req.params;

        const {
            title,
            description,
            agency_id,
            category_id,
            requirements,
            deadline,
            status,
            image
        } = req.body;


        const result = await pool.query(`
            UPDATE auditions
            SET
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                agency_id = COALESCE($3, agency_id),
                category_id = COALESCE($4, category_id),
                requirements = COALESCE($5, requirements),
                deadline = COALESCE($6, deadline),
                status = COALESCE($7, status),
                image = COALESCE($8, image)
            WHERE id = $9
            RETURNING *
        `, [
            title,
            description,
            agency_id,
            category_id,
            requirements,
            deadline,
            status,
            image,
            id
        ]);


        if (result.rows.length === 0) {

            return errorResponse(
                res,
                "Audition not found.",
                404
            );

        }


        return successResponse(
            res,
            result.rows[0],
            "Audition updated successfully."
        );

    } catch (error) {

        console.error("Update audition error:", error);

        return errorResponse(
            res,
            "Unable to update audition.",
            500
        );

    }
}


// ========================================
// DELETE AUDITION
// ========================================

async function deleteAudition(req, res) {

    try {

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM auditions WHERE id = $1 RETURNING id",
            [id]
        );


        if (result.rows.length === 0) {

            return errorResponse(
                res,
                "Audition not found.",
                404
            );

        }


        return successResponse(
            res,
            {
                id: result.rows[0].id
            },
            "Audition deleted successfully."
        );

    } catch (error) {

        console.error("Delete audition error:", error);

        return errorResponse(
            res,
            "Unable to delete audition.",
            500
        );

    }
}


// ========================================
// EXPORT
// ========================================

module.exports = {
    getAuditions,
    getAuditionById,
    createAudition,
    updateAudition,
    deleteAudition
};