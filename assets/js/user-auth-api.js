
"use strict";

const AUTH_API = "/api/auth";

function getField(id) {
    return document.getElementById(id)?.value.trim() || "";
}

async function sendAuthRequest(endpoint, payload) {
    const response = await fetch(`${AUTH_API}/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Request failed."
        );
    }

    return result;
}

async function registerUser(event) {
    event.preventDefault();

    const name = getField("fullName");
    const email = getField("email").toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;
    const date_of_birth = getField("dob");

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    const button = event.target.querySelector(
        'button[type="submit"]'
    );

    button.disabled = true;

    try {
        const result = await sendAuthRequest("register", {
            name,
            email,
            password,
            date_of_birth: date_of_birth || null
        });

        alert(result.message);
        window.location.replace("login.html");

    } catch (error) {
        alert(error.message);
    } finally {
        button.disabled = false;
    }
}

async function loginUser(event) {
    event.preventDefault();

    const email = getField("email").toLowerCase();
    const password = document.getElementById("password").value;

    const button = event.target.querySelector(
        'button[type="submit"]'
    );

    button.disabled = true;

    try {
        const result = await sendAuthRequest("login", {
            email,
            password
        });

        const { token, user } = result.data;

        if (user.role !== "user") {
            alert("Please use the correct role login page.");
            return;
        }

        sessionStorage.setItem("starwave_token", token);
        sessionStorage.setItem(
            "starwave_user",
            JSON.stringify(user)
        );

        window.location.replace("dashboard.html");

    } catch (error) {
        alert(error.message);
    } finally {
        button.disabled = false;
    }
}

async function checkUserSession() {
    const token = sessionStorage.getItem("starwave_token");

    if (!token) {
        window.location.replace("login.html");
        return null;
    }

    try {
        const response = await fetch("/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Session expired");
        }

        const result = await response.json();
        const user = result.data;

        if (!result.success || !user || user.role !== "user") {
            throw new Error("Invalid session");
        }

        sessionStorage.setItem(
            "starwave_user",
            JSON.stringify(user)
        );

        return user;

    } catch (error) {
        sessionStorage.removeItem("starwave_token");
        sessionStorage.removeItem("starwave_user");
        window.location.replace("login.html");
        return null;
    }
}

function logoutUser() {
    sessionStorage.removeItem("starwave_token");
    sessionStorage.removeItem("starwave_user");
    window.location.replace("login.html");
}
