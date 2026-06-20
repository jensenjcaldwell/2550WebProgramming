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
		link.classList.toggle("active", link.dataset.target === targetId);
	});
}

menuLinks.forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
		showPane(link.dataset.target);
	});
});
