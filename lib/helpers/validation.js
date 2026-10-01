// ========================================
// STARWAVE - VALIDATION HELPERS
// ========================================

function isRequired(value) {
    return value !== undefined &&
           value !== null &&
           String(value).trim() !== "";
}


function isValidEmail(email) {
    if (!isRequired(email)) {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function isValidPassword(password) {
    return isRequired(password) && password.length >= 6;
}


function validateRequiredFields(data, fields) {

    const missingFields = [];

    fields.forEach(function (field) {

        if (!isRequired(data[field])) {
            missingFields.push(field);
        }

    });

    return missingFields;
}


module.exports = {
    isRequired,
    isValidEmail,
    isValidPassword,
    validateRequiredFields
};