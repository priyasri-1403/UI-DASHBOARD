const addTranslate = (block, containerClass) => {
  setTimeout(() => {
    const navButton = document.querySelector('.nav-hamburger button');
    const projectContainer = block.closest(containerClass);
    const nav = document.getElementById('nav');
    projectContainer.classList.add('main-container-shift');
 
    window.addEventListener('resize', () => {
      if (nav.getAttribute('aria-expanded') === 'true') {
        projectContainer.classList.remove('main-container');
        projectContainer.classList.add('main-container-shift');
      } else {
        projectContainer.classList.remove('main-container-shift');
        projectContainer.classList.add('main-container');
      }
    });
 
    if (navButton && projectContainer) {
      navButton.addEventListener('click', () => {
        projectContainer.classList.toggle('main-container');
        projectContainer.classList.toggle('main-container-shift');
      });
    }
  }, 150);
};
 
export default addTranslate;