// ========================================
// STARWAVE - COMMON JAVASCRIPT
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // CURRENT YEAR
    // ===============================

    const yearElements = document.querySelectorAll(".current-year");

    yearElements.forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


    // ===============================
    // ACTIVE NAVIGATION LINK
    // ===============================

    const currentPage = window.location.pathname.split("/").pop();

    const navLinks = document.querySelectorAll(".navbar a");

    navLinks.forEach(function (link) {

        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }

    });


    // ===============================
    // MOBILE MENU
    // ===============================

    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".navbar nav");

    if (menuButton && nav) {

        menuButton.addEventListener("click", function () {
            nav.classList.toggle("show");
        });

    }

});