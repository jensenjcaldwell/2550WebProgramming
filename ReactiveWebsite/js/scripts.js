// Followed: Canvas Project Specification

const menuLinks = document.querySelectorAll(".menu-link");
const panes = document.querySelectorAll(".tab-pane");

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
