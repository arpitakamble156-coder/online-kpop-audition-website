function logout() {
    if (confirm("Are you sure you want to log out?")) {
        location.href = "login.html";
    }
}

function filterTable(inputId, tableId) {

    const input = document.getElementById(inputId);

    const table = document.getElementById(tableId);

    if (!input || !table) {
        return;
    }

    const searchText = input.value.toLowerCase();

    const rows = table.querySelectorAll("tbody tr");

    rows.forEach(function (row) {

        const text = row.innerText.toLowerCase();

        if (text.includes(searchText)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });
}

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll("[data-confirm]").forEach(function (button) {

        button.addEventListener("click", function (event) {

            const message = button.dataset.confirm;

            if (!confirm(message)) {
                event.preventDefault();
            }

        });

    });

});