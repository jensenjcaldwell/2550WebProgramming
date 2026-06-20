const portraitImage = document.getElementById('portraitImage');
const imageModal = document.getElementById('imageModal');
const modalClose = document.getElementById('modalClose');

function openModal() {
  imageModal.classList.add('visible');
  imageModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  imageModal.classList.remove('visible');
  imageModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

if (portraitImage && imageModal && modalClose) {
  portraitImage.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);

  imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageModal.classList.contains('visible')) {
      closeModal();
    }
  });
}
