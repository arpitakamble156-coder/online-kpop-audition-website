
"use strict";

// ========================================
// STARWAVE - USER AUTHENTICATION
// Neon PostgreSQL via Express API
// ========================================

const STARWAVE_TOKEN_KEY = "starwave_user_token";
const STARWAVE_USER_KEY = "starwave_user";


// ========================================
// API REQUEST HELPER
// ========================================

async function starwaveApi(path, options = {}) {
    let response;

    try {
        response = await fetch(path, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });
    } catch (error) {
        throw new Error(
            "Unable to connect to the server. Check your internet connection."
        );
    }

    const contentType =
        response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
        throw new Error(
            "Invalid server response. Please check the Vercel API deployment."
        );
    }

    const result = await response.json();

    if (!response.ok || result.success !== true) {
        throw new Error(
            result.message ||
            `Request failed with status ${response.status}`
        );
    }

    return result.data;
}


// ========================================
// REGISTER USER
// ========================================

async function registerUser(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector(
        'button[type="submit"]'
    );

    const name = document
        .getElementById("fullName")
        .value.trim();

    const email = document
        .getElementById("email")
        .value.trim()
        .toLowerCase();

    const username = document
        .getElementById("username")
        .value.trim();

    const password = document
        .getElementById("password")
        .value;

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value;

    const date_of_birth = document
        .getElementById("dob")
        .value;

    const terms = document
        .getElementById("terms")
        .checked;

    if (
        !name ||
        !email ||
        !username ||
        !password ||
        !date_of_birth
    ) {
        alert("Please fill in all required fields.");
        return;
    }

    if (password.length < 6) {
        alert(
            "Password must contain at least 6 characters."
        );
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (!terms) {
        alert(
            "Please accept the Terms & Conditions."
        );
        return;
    }

    button.disabled = true;
    button.textContent = "Creating Account...";

    try {
        // The existing users table does not
        // contain a username column.
        // Registration uses name and email.

        await starwaveApi("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password,
                date_of_birth
            })
        });

        alert(
            "Account created successfully! Please login."
        );

        window.location.replace("login.html");

    } catch (error) {
        console.error("Registration error:", error);
        alert(error.message);

    } finally {
        button.disabled = false;
        button.textContent = "Create Account";
    }
}


// ========================================
// LOGIN USER
// ========================================

async function loginUser(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const button = form.querySelector(
        'button[type="submit"]'
    );

    const email = document
        .getElementById("email")
        .value.trim()
        .toLowerCase();

    const password = document
        .getElementById("password")
        .value;

    if (!email || !password) {
        alert(
            "Please enter your email and password."
        );
        return;
    }

    button.disabled = true;
    button.textContent = "Logging in...";

    try {
        const data = await starwaveApi(
            "/api/auth/login",
            {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        if (!data || !data.token || !data.user) {
            throw new Error(
                "Invalid authentication response."
            );
        }

        if (data.user.role !== "user") {
            throw new Error(
                "This account cannot access the user dashboard."
            );
        }

        // Clear any previous user session
        localStorage.removeItem(STARWAVE_TOKEN_KEY);
        localStorage.removeItem(STARWAVE_USER_KEY);

        // Save new authenticated session
        localStorage.setItem(
            STARWAVE_TOKEN_KEY,
            data.token
        );

        localStorage.setItem(
            STARWAVE_USER_KEY,
            JSON.stringify(data.user)
        );

        window.location.replace("dashboard.html");

    } catch (error) {
        console.error("Login error:", error);
        alert(error.message);

    } finally {
        button.disabled = false;
        button.textContent = "Login";
    }
}


// ========================================
// CHECK USER SESSION
// ========================================

async function checkUserSession() {
    const token = localStorage.getItem(
        STARWAVE_TOKEN_KEY
    );

    if (!token) {
        window.location.replace("login.html");
        return null;
    }

    try {
        const user = await starwaveApi(
            "/api/auth/me",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!user || user.role !== "user") {
            throw new Error("Access denied.");
        }

        localStorage.setItem(
            STARWAVE_USER_KEY,
            JSON.stringify(user)
        );

        return user;

    } catch (error) {
        console.error(
            "Session verification failed:",
            error
        );

        localStorage.removeItem(STARWAVE_TOKEN_KEY);
        localStorage.removeItem(STARWAVE_USER_KEY);

        window.location.replace("login.html");
        return null;
    }
}


// ========================================
// LOGOUT USER
// ========================================

function logoutUser() {
    const confirmed = confirm(
        "Are you sure you want to log out?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(STARWAVE_TOKEN_KEY);
    localStorage.removeItem(STARWAVE_USER_KEY);

    window.location.replace("login.html");
}


// ========================================
// SHOW / HIDE PASSWORD
// ========================================

function togglePassword(inputId, checkbox) {
    const input = document.getElementById(inputId);

    if (!input) {
        return;
    }

    if (checkbox) {
        input.type = checkbox.checked
            ? "text"
            : "password";
    } else {
        input.type = input.type === "password"
            ? "text"
            : "password";
    }
}
