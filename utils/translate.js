const addTranslate = (block, containerClass) => {
  setTimeout(() => {
    const navButton = document.querySelector('.nav-hamburger button');
    const projectContainer = block.closest(containerClass);
    const nav = document.getElementById('nav');
    projectContainer.classList.add('main-container');

    if (navButton && projectContainer) {
      // Initial check
      if (nav.getAttribute('aria-expanded') === 'true') {
        projectContainer.classList.add('main-container-shift');
      }
      navButton.addEventListener('click', () => {
        projectContainer.classList.toggle('main-container-shift');
      });
    }
  }, 150);
};

export default addTranslate;
