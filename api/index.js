// ========================================
// STARWAVE - NODE.JS BACKEND
// ========================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();


// ========================================
// CONTROLLERS
// ========================================

const {
    registerUser,
    loginUser,
    getCurrentUser
} = require("../lib/controllers/authController");

const {
    getAuditions,
    getAuditionById,
    createAudition,
    updateAudition,
    deleteAudition
} = require("../lib/controllers/auditionController");

const {
    createApplication,
    getMyApplications,
    getApplicationById,
    updateApplicationStatus
} = require("../lib/controllers/applicationController");

const {
    createSubmission,
    getMySubmissions,
    getSubmissionById
} = require("../lib/controllers/submissionController");

const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../lib/controllers/categoryController");

const {
    getAgencies,
    getAgencyById,
    createAgency,
    updateAgency,
    deleteAgency
} = require("../lib/controllers/agencyController");

const {
    getJudges,
    getJudgeById,
    createJudge,
    deleteJudge
} = require("../lib/controllers/judgeController");

const {
    createEvaluation,
    getEvaluations,
    getMyEvaluations
} = require("../lib/controllers/evaluationController");

const {
    getMyResults,
    getResultById,
    createResult,
    getAllResults
} = require("../lib/controllers/resultController");

const {
    getMyNotifications,
    markAsRead,
    createNotification
} = require("../lib/controllers/notificationController");

const {
    getProfile,
    updateProfile
} = require("../lib/controllers/profileController");

const {
    createContactMessage,
    getContactMessages
} = require("../lib/controllers/contactController");

const {
    getDashboardStats,
    getUsers,
    deleteUser
} = require("../lib/controllers/adminController");


// ========================================
// AUTHENTICATION
// ========================================

const {
    authenticateToken,
    requireRole
} = require("../lib/auth");


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ========================================
// API HOME
// ========================================

app.get("/api", (req, res) => {

    res.json({
        success: true,
        message: "StarWave API is running!"
    });

});


// ========================================
// HEALTH CHECK
// ========================================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        status: "OK"
    });

});


// ========================================
// AUTH ROUTES
// ========================================

app.post(
    "/api/auth/register",
    registerUser
);

app.post(
    "/api/auth/login",
    loginUser
);

app.get(
    "/api/auth/me",
    authenticateToken,
    getCurrentUser
);


// ========================================
// AUDITION ROUTES
// ========================================

// Public
app.get(
    "/api/auditions",
    getAuditions
);

app.get(
    "/api/auditions/:id",
    getAuditionById
);


// Admin
app.post(
    "/api/auditions",
    authenticateToken,
    requireRole("admin"),
    createAudition
);

app.put(
    "/api/auditions/:id",
    authenticateToken,
    requireRole("admin"),
    updateAudition
);

app.delete(
    "/api/auditions/:id",
    authenticateToken,
    requireRole("admin"),
    deleteAudition
);


// ========================================
// APPLICATION ROUTES
// ========================================

app.post(
    "/api/applications",
    authenticateToken,
    requireRole("user"),
    createApplication
);

app.get(
    "/api/applications",
    authenticateToken,
    requireRole("user"),
    getMyApplications
);

app.get(
    "/api/applications/:id",
    authenticateToken,
    requireRole("user"),
    getApplicationById
);


// Admin
app.put(
    "/api/applications/:id/status",
    authenticateToken,
    requireRole("admin"),
    updateApplicationStatus
);


// ========================================
// SUBMISSION ROUTES
// ========================================

app.post(
    "/api/submissions",
    authenticateToken,
    requireRole("user"),
    createSubmission
);

app.get(
    "/api/submissions",
    authenticateToken,
    requireRole("user"),
    getMySubmissions
);

app.get(
    "/api/submissions/:id",
    authenticateToken,
    requireRole("user"),
    getSubmissionById
);


// ========================================
// CATEGORY ROUTES
// ========================================

// Public
app.get(
    "/api/categories",
    getCategories
);

app.get(
    "/api/categories/:id",
    getCategoryById
);


// Admin
app.post(
    "/api/categories",
    authenticateToken,
    requireRole("admin"),
    createCategory
);

app.put(
    "/api/categories/:id",
    authenticateToken,
    requireRole("admin"),
    updateCategory
);

app.delete(
    "/api/categories/:id",
    authenticateToken,
    requireRole("admin"),
    deleteCategory
);


// ========================================
// AGENCY ROUTES
// ========================================

// Public
app.get(
    "/api/agencies",
    getAgencies
);

app.get(
    "/api/agencies/:id",
    getAgencyById
);


// Admin
app.post(
    "/api/agencies",
    authenticateToken,
    requireRole("admin"),
    createAgency
);

app.put(
    "/api/agencies/:id",
    authenticateToken,
    requireRole("admin"),
    updateAgency
);

app.delete(
    "/api/agencies/:id",
    authenticateToken,
    requireRole("admin"),
    deleteAgency
);


// ========================================
// JUDGE ROUTES
// ========================================

// Admin
app.get(
    "/api/judges",
    authenticateToken,
    requireRole("admin"),
    getJudges
);

app.get(
    "/api/judges/:id",
    authenticateToken,
    requireRole("admin"),
    getJudgeById
);

app.post(
    "/api/judges",
    authenticateToken,
    requireRole("admin"),
    createJudge
);

app.delete(
    "/api/judges/:id",
    authenticateToken,
    requireRole("admin"),
    deleteJudge
);


// ========================================
// EVALUATION ROUTES
// ========================================

// Judge
app.post(
    "/api/evaluations",
    authenticateToken,
    requireRole("judge"),
    createEvaluation
);

app.get(
    "/api/evaluations",
    authenticateToken,
    requireRole("judge", "admin"),
    getEvaluations
);


// User
app.get(
    "/api/my-evaluations",
    authenticateToken,
    requireRole("user"),
    getMyEvaluations
);


// ========================================
// RESULT ROUTES
// ========================================

// User
app.get(
    "/api/results",
    authenticateToken,
    requireRole("user"),
    getMyResults
);

app.get(
    "/api/results/:id",
    authenticateToken,
    requireRole("user"),
    getResultById
);


// Admin
app.get(
    "/api/admin/results",
    authenticateToken,
    requireRole("admin"),
    getAllResults
);

app.post(
    "/api/results",
    authenticateToken,
    requireRole("admin"),
    createResult
);


// ========================================
// NOTIFICATION ROUTES
// ========================================

app.get(
    "/api/notifications",
    authenticateToken,
    requireRole("user"),
    getMyNotifications
);

app.put(
    "/api/notifications/:id/read",
    authenticateToken,
    requireRole("user"),
    markAsRead
);


// Admin
app.post(
    "/api/notifications",
    authenticateToken,
    requireRole("admin"),
    createNotification
);


// ========================================
// PROFILE ROUTES
// ========================================

app.get(
    "/api/profile",
    authenticateToken,
    getProfile
);

app.put(
    "/api/profile",
    authenticateToken,
    updateProfile
);


// ========================================
// CONTACT ROUTES
// ========================================

// Public
app.post(
    "/api/contact",
    createContactMessage
);


// Admin
app.get(
    "/api/contact",
    authenticateToken,
    requireRole("admin"),
    getContactMessages
);


// ========================================
// ADMIN ROUTES
// ========================================

app.get(
    "/api/admin/dashboard",
    authenticateToken,
    requireRole("admin"),
    getDashboardStats
);

app.get(
    "/api/admin/users",
    authenticateToken,
    requireRole("admin"),
    getUsers
);

app.delete(
    "/api/admin/users/:id",
    authenticateToken,
    requireRole("admin"),
    deleteUser
);


// ========================================
// 404 API ROUTE
// ========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// ========================================
// ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {

    console.error("Server error:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error."
    });

});


// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 3000;

if (require.main === module) {

    app.listen(PORT, () => {

        console.log(
            `StarWave server running on port ${PORT}`
        );

    });

}


// ========================================
// EXPORT APP
// ========================================

module.exports = app;