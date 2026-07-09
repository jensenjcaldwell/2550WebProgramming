// Followed: Canvas Project Specification

const menuLinks = document.querySelectorAll(".menu-link");
const panes = document.querySelectorAll(".tab-pane");
const themeToggleButton = document.getElementById("theme-toggle-btn");
const themeHref = "css/theme.css?v=20260709";
const themeLinkId = "theme-stylesheet";

function getThemeLinkElement() {
	return document.getElementById(themeLinkId);
}

function setThemeButtonState(isEnabled) {
	if (!themeToggleButton) {
		return;
	}

	themeToggleButton.setAttribute("aria-pressed", String(isEnabled));
	themeToggleButton.textContent = isEnabled ? "Light Theme" : "Dark Theme";
}

function enableTheme() {
	if (getThemeLinkElement()) {
		setThemeButtonState(true);
		return;
	}

	const link = document.createElement("link");
	link.id = themeLinkId;
	link.rel = "stylesheet";
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

if (themeToggleButton) {
	setThemeButtonState(false);
	themeToggleButton.addEventListener("click", () => {
		if (getThemeLinkElement()) {
			disableTheme();
		} else {
			enableTheme();
		}
	});
}

function showPane(targetId) {
	panes.forEach((pane) => {
		const isActive = pane.id === targetId;
		pane.classList.toggle("active", isActive);
		pane.classList.remove("enter-animate");

		if (isActive) {
			// Play animation each time the tab is opened.
			void pane.offsetWidth;
			pane.classList.add("enter-animate");
		}
	});

	menuLinks.forEach((link) => {
		const target = link.getAttribute("href")?.replace("#", "") || "";
		link.classList.toggle("active", target === targetId);
	});
}

menuLinks.forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
		const targetId = link.getAttribute("href")?.replace("#", "") || "home";
		showPane(targetId);
		window.location.hash = targetId;
	});
});

const initialPane = window.location.hash.replace("#", "");
if (initialPane && document.getElementById(initialPane)) {
	showPane(initialPane);
} else {
	showPane("home");
}
