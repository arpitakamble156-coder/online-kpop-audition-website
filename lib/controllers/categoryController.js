// ========================================
// STARWAVE - CATEGORY CONTROLLER
// ========================================

const pool = require("../db");
const { successResponse, errorResponse } = require("../helpers/response");


// GET ALL CATEGORIES
async function getCategories(req, res) {
    try {
        const result = await pool.query(
            `SELECT *
             FROM categories
             ORDER BY name ASC`
        );

        return successResponse(
            res,
            result.rows,
            "Categories retrieved successfully."
        );

    } catch (error) {
        console.error("Get categories error:", error);
        return errorResponse(res, "Unable to retrieve categories.", 500);
    }
}


// GET CATEGORY BY ID
async function getCategoryById(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM categories
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "Category not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Category retrieved successfully."
        );

    } catch (error) {
        console.error("Get category error:", error);
        return errorResponse(res, "Unable to retrieve category.", 500);
    }
}


// CREATE CATEGORY
async function createCategory(req, res) {
    try {
        const { name, description } = req.body;

        if (!name) {
            return errorResponse(res, "Category name is required.", 400);
        }

        const result = await pool.query(
            `INSERT INTO categories
             (name, description)
             VALUES ($1, $2)
             RETURNING *`,
            [name, description || null]
        );

        return successResponse(
            res,
            result.rows[0],
            "Category created successfully.",
            201
        );

    } catch (error) {
        console.error("Create category error:", error);
        return errorResponse(res, "Unable to create category.", 500);
    }
}


// UPDATE CATEGORY
async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const result = await pool.query(
            `UPDATE categories
             SET
                name = COALESCE($1, name),
                description = COALESCE($2, description)
             WHERE id = $3
             RETURNING *`,
            [name, description, id]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "Category not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Category updated successfully."
        );

    } catch (error) {
        console.error("Update category error:", error);
        return errorResponse(res, "Unable to update category.", 500);
    }
}


// DELETE CATEGORY
async function deleteCategory(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM categories
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "Category not found.", 404);
        }

        return successResponse(
            res,
            result.rows[0],
            "Category deleted successfully."
        );

    } catch (error) {
        console.error("Delete category error:", error);
        return errorResponse(res, "Unable to delete category.", 500);
    }
}


module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};