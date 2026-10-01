// ========================================
// STARWAVE - AUTHENTICATION JAVASCRIPT
// ========================================


// ===============================
// LOGIN
// ===============================

function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if (!email || !password) {
        return;
    }

    if (email.value.trim() === "" || password.value.trim() === "") {

        alert("Please enter your email and password.");

        return;
    }

    alert("Login successful!");

    window.location.href = "dashboard.html";
}


// ===============================
// LOGOUT
// ===============================

function logoutUser() {

    const confirmLogout = confirm("Are you sure you want to log out?");

    if (confirmLogout) {

        window.location.href = "login.html";

    }
}


// ===============================
// REGISTER
// ===============================

function registerUser(event) {

    event.preventDefault();

    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    if (!password || !confirmPassword) {
        return;
    }

    if (password.value !== confirmPassword.value) {

        alert("Passwords do not match.");

        return;
    }

    alert("Account created successfully!");

    window.location.href = "login.html";
}


// ===============================
// PASSWORD VISIBILITY
// ===============================

function togglePassword(inputId) {

    const passwordInput = document.getElementById(inputId);

    if (!passwordInput) {
        return;
    }

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

    } else {

        passwordInput.type = "password";

    }
}