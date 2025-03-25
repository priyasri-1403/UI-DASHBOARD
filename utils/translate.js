const addTranslate = (block, containerClass) => {
  setTimeout(() => {
    const navButton = document.querySelector('.nav-hamburger button');
    const projectContainer = block.closest(containerClass);
    const nav = document.getElementById('nav');
    projectContainer.classList.add('main-container');

    if (navButton && projectContainer) {
      // Get saved nav state or default to closed
      const navExpanded = localStorage.getItem('navExpanded') === 'true';
      // Set initial state based on saved preference
      if (navExpanded) {
        nav.setAttribute('aria-expanded', 'true');
        projectContainer.classList.add('main-container-shift');
      } else {
        nav.setAttribute('aria-expanded', 'false');
        projectContainer.classList.remove('main-container-shift');
      }
      navButton.addEventListener('click', () => {
        projectContainer.classList.toggle('main-container-shift');
        // Save the new state to localStorage
        const isExpanded = projectContainer.classList.contains('main-container-shift');
        localStorage.setItem('navExpanded', isExpanded);
      });
    }
  }, 150);
};

export default addTranslate;
