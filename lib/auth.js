// ========================================
// STARWAVE - AUTHENTICATION HELPERS
// ========================================

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ========================================
// HASH PASSWORD
// ========================================

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}


// ========================================
// COMPARE PASSWORD
// ========================================

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}


// ========================================
// CREATE TOKEN
// ========================================

function createToken(user) {

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
}


// ========================================
// VERIFY TOKEN
// ========================================

function verifyToken(token) {

    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
}


// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            success: false,
            message: "Authentication token is required."
        });

    }

    const token = authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            success: false,
            message: "Invalid authentication token."
        });

    }

    try {

        const user = verifyToken(token);

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }
}


// ========================================
// ROLE CHECK
// ========================================

function requireRole(...allowedRoles) {

    return function (req, res, next) {

        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });

        }

        if (!allowedRoles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource."
            });

        }

        next();

    };
}


// ========================================
// EXPORT
// ========================================

module.exports = {
    hashPassword,
    comparePassword,
    createToken,
    verifyToken,
    authenticateToken,
    requireRole
};