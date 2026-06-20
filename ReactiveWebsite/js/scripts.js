const menuLinks = document.querySelectorAll(".menu-link");
const panes = document.querySelectorAll(".tab-pane");

function showPane(targetId) {
	panes.forEach((pane) => {
		pane.classList.toggle("active", pane.id === targetId);
	});

	menuLinks.forEach((link) => {
		link.classList.toggle("active", link.dataset.target === targetId);
	});
}

menuLinks.forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
		showPane(link.dataset.target);
	});
});
