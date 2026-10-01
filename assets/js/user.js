/* =================================
   STARWAVE USER JAVASCRIPT
================================= */


/* =================================
   LOGOUT
================================= */

function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to log out?"
    );

    if (confirmLogout) {
        window.location.href = "login.html";
    }
}


/* =================================
   SHOW PASSWORD
================================= */

function togglePassword(inputId, checkbox) {

    const passwordInput = document.getElementById(inputId);

    if (!passwordInput) return;

    if (checkbox.checked) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}


/* =================================
   PASSWORD MATCH
================================= */

function checkPasswordMatch(
    passwordId,
    confirmPasswordId,
    messageId
) {

    const password =
        document.getElementById(passwordId);

    const confirmPassword =
        document.getElementById(confirmPasswordId);

    const message =
        document.getElementById(messageId);

    if (!password || !confirmPassword) return;

    if (confirmPassword.value === "") {

        if (message) {
            message.textContent = "";
        }

        return;
    }

    if (password.value === confirmPassword.value) {

        if (message) {
            message.textContent = "Passwords match.";
            message.style.color = "#6ee7a0";
        }

    } else {

        if (message) {
            message.textContent = "Passwords do not match.";
            message.style.color = "#fca5a5";
        }
    }
}


/* =================================
   SEARCH TABLE
================================= */

function searchTable(inputId, tableId) {

    const input =
        document.getElementById(inputId);

    const table =
        document.getElementById(tableId);

    if (!input || !table) return;

    const searchText =
        input.value.toLowerCase();

    const rows =
        table.querySelectorAll("tbody tr");

    rows.forEach(function (row) {

        const text =
            row.innerText.toLowerCase();

        if (text.includes(searchText)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });
}


/* =================================
   ALERT MESSAGE
================================= */

function showMessage(message) {

    alert(message);

}


/* =================================
   CONFIRM ACTION
================================= */

function confirmAction(message) {

    return confirm(
        message || "Are you sure you want to continue?"
    );

}


/* =================================
   FILE NAME DISPLAY
================================= */

function showFileName(inputId, outputId) {

    const input =
        document.getElementById(inputId);

    const output =
        document.getElementById(outputId);

    if (!input || !output) return;

    if (input.files.length > 0) {

        output.textContent =
            input.files[0].name;

    } else {

        output.textContent =
            "No file selected";

    }
}


/* =================================
   PREVIEW PROFILE IMAGE
================================= */

function previewImage(inputId, imageId) {

    const input =
        document.getElementById(inputId);

    const image =
        document.getElementById(imageId);

    if (!input || !image) return;

    if (input.files && input.files[0]) {

        const reader = new FileReader();

        reader.onload = function (event) {

            image.src = event.target.result;

        };

        reader.readAsDataURL(input.files[0]);
    }
}


/* =================================
   FORM SUBMIT DEMO
================================= */

function submitForm(event, message, redirectPage) {

    event.preventDefault();

    alert(
        message || "Your information has been submitted successfully."
    );

    if (redirectPage) {
        window.location.href = redirectPage;
    }

}


/* =================================
   MOBILE NAVIGATION
================================= */

function toggleMenu() {

    const nav =
        document.querySelector(".nav-links");

    if (!nav) return;

    nav.classList.toggle("show");

}


/* =================================
   DOM READY
================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Confirm buttons */

        document
            .querySelectorAll("[data-confirm]")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        const message =
                            button.dataset.confirm;

                        if (!confirm(message)) {
                            event.preventDefault();
                        }

                    }
                );

            });


        /* Password confirmation */

        const password =
            document.getElementById("password");

        const confirmPassword =
            document.getElementById("confirmPassword");

        if (password && confirmPassword) {

            confirmPassword.addEventListener(
                "input",
                function () {

                    checkPasswordMatch(
                        "password",
                        "confirmPassword",
                        "passwordMessage"
                    );

                }
            );

        }

    }
);