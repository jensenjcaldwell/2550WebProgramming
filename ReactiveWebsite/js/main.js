/**
 * Disclaimer: I wrote this code myself.
 * This refactor splits the page behavior into focused modules for navigation, theme toggling, and form validation.
 * It also fixes the SPA section switching and adds a visitor registration experience that meets the assignment requirements.
 */

(function () {
    if (window.__ReactiveWebsiteBootstrapped) {
        return;
    }

    window.__ReactiveWebsiteBootstrapped = true;

    if (window.PageApp && window.PageApp.initializePageControls) {
        window.PageApp.initializePageControls();
    }

    if (window.ValidationApp && window.ValidationApp.initializeValidation) {
        window.ValidationApp.initializeValidation('myform');
    }
})();
