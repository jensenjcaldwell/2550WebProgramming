(function () {
    if (window.__ReactiveWebsitePageInitialized) {
        return;
    }

    window.__ReactiveWebsitePageInitialized = true;

    const menuLinks = Array.from(document.querySelectorAll('.menu-link'));
    const panes = Array.from(document.querySelectorAll('.tab-pane'));
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const themeHref = 'css/theme.css?v=20260731';
    const themeLinkId = 'theme-stylesheet';

    function getThemeLinkElement() {
        return document.getElementById(themeLinkId);
    }

    function setThemeButtonState(isEnabled) {
        if (!themeToggleButton) {
            return;
        }

        themeToggleButton.setAttribute('aria-pressed', String(isEnabled));
        themeToggleButton.textContent = isEnabled ? 'Light Theme' : 'Dark Theme';
    }

    function enableTheme() {
        if (getThemeLinkElement()) {
            setThemeButtonState(true);
            return;
        }

        const link = document.createElement('link');
        link.id = themeLinkId;
        link.rel = 'stylesheet';
        link.href = themeHref;
        document.head.appendChild(link);
        setThemeButtonState(true);
    }

    function disableTheme() {
        const link = getThemeLinkElement();
        if (!link) {
            setThemeButtonState(false);
            return;
        }

        link.remove();
        setThemeButtonState(false);
    }

    function showPane(targetId) {
        panes.forEach((pane) => {
            const isActive = pane.id === targetId;
            pane.classList.toggle('active', isActive);
            pane.classList.remove('enter-animate');

            if (isActive) {
                void pane.offsetWidth;
                pane.classList.add('enter-animate');
            }
        });

        menuLinks.forEach((link) => {
            const target = link.getAttribute('href')?.replace('#', '') || '';
            link.classList.toggle('active', target === targetId);
        });
    }

    function initializePageControls() {
        if (themeToggleButton) {
            setThemeButtonState(false);
            themeToggleButton.addEventListener('click', () => {
                if (getThemeLinkElement()) {
                    disableTheme();
                } else {
                    enableTheme();
                }
            });
        }

        menuLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.getAttribute('href')?.replace('#', '') || 'home';
                showPane(targetId);
                window.location.hash = targetId;
            });
        });

        const initialPane = window.location.hash.replace('#', '');
        if (initialPane && document.getElementById(initialPane)) {
            showPane(initialPane);
        } else {
            showPane('home');
        }
    }

    window.PageApp = window.PageApp || {};
    window.PageApp.showPane = showPane;
    window.PageApp.initializePageControls = initializePageControls;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePageControls);
    } else {
        initializePageControls();
    }
})();
