/* =================================
   STARWAVE JUDGE JAVASCRIPT
================================= */

function logout() {

    if (confirm("Are you sure you want to log out?")) {

        window.location.href = "login.html";

    }

}


/* ================================
   SEARCH TABLE
================================ */

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

    rows.forEach(function(row) {

        const text =
            row.innerText.toLowerCase();

        if (text.includes(searchText)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}


/* ================================
   SHOW MESSAGE
================================ */

function showMessage(message) {

    alert(message);

}


/* ================================
   SAVE EVALUATION
================================ */

function saveEvaluation(event) {

    event.preventDefault();

    alert("Evaluation saved successfully!");

}


/* ================================
   CONFIRM ACTION
================================ */

function confirmAction(message) {

    return confirm(
        message || "Are you sure you want to continue?"
    );

}