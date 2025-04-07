import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1024px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  localStorage.setItem('isExpanded', nav.getAttribute('aria-expanded'));
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function listenEvents(block) {
  block.querySelector('.user-wrapper img')?.addEventListener('click', (e) => {
  
    block.querySelector('.theme-wrap').classList.toggle('hide');
    setBorder(block);
  });

  block.querySelector('.dark-btn')?.addEventListener('click', () => {
     document.body.classList.add('dark-theme');
    localStorage.setItem("theme",'dark-theme');
    
  block.querySelector('.light-box').classList.remove('selected');
  block.querySelector('.dark-box').classList.add('selected');


  });

  block.querySelector('.light-btn')?.addEventListener('click', () => {
    document.body.classList.remove('dark-theme');
    localStorage.removeItem("theme");
    block.querySelector('.dark-box').classList.remove('selected');
    block.querySelector('.light-box').classList.add('selected');
    // document.body.classList.add('light-theme');
   


  });
}

function createThemeBox(block) {
  const userWrap = block.querySelector('.user-wrapper');
  const themeWrap = document.createElement('div');
  themeWrap.classList = 'theme-wrap hide';
  
themeWrap.innerHTML = `
  <div class="light-btn ">
  <div class="light-box "> 
    <img class="light-img" src="../../icons/light-theme.png" alt="Light Theme" />
    </div>
    <span class="light-span">Light</span>
  </div>
  <div class="dark-btn">
  <div class="dark-box">
    <img class="dark-img" src="../../icons/dark-theme.png" alt="Dark Theme" />
    </div>
    <span class ="dark-span">Dark</span>
  </div>
`;


  userWrap.appendChild(themeWrap);
}

function changeMenuStructure(block) {
  const screenSize = window.innerWidth;
  const userWrapper = block.querySelector('.user-wrapper');
  const navIcon = block.querySelector('.nav-hamburger');
  const navBrand = block.querySelector('.nav-brand');
  const menuWrapper = block.querySelector('.menu-wrap');

  if (!userWrapper || !navIcon || !navBrand || !menuWrapper) {
    console.warn('Some elements are missing, retrying...');
    setTimeout(() => {
      changeMenuStructure(block);
    }, 100); // Retry after 100ms
    return;
  }

  if (screenSize >= 768) {
    userWrapper.classList.remove('hide');

    if (!block.querySelector('.nav-container')) {
      const navContainer = document.createElement('div');
      navContainer.className = 'nav-container';
      navContainer.appendChild(navIcon);
      navContainer.appendChild(navBrand);
      menuWrapper.prepend(navContainer);
    }
  } else if (screenSize < 768) {
    userWrapper.classList.add('hide');
    menuWrapper.prepend(navBrand);
    menuWrapper.prepend(navIcon);
    const navContainer = block.querySelector('.nav-container');
    navContainer?.remove();

    // if(navContainer){
    //   navContainer.remove();
    // }
  }
}
function setTheme(){
  document.body.classList.remove("dark-theme");

  if(localStorage.getItem("theme")){
    document.body.classList.add(localStorage.getItem("theme"));
  }

  
}

function setBorder(block){
  
  block.querySelector('.dark-box').classList.remove('selected');
  console.log("3")
  block.querySelector('.light-box').classList.add('selected');

  if(localStorage.getItem("theme")){
    block.querySelector('.dark-box').classList.add('selected');
    block.querySelector('.light-box').classList.remove('selected');
  }

  
}



function setNavState(nav) {
  const navState = localStorage.getItem('isExpanded');
  if (!navState) {
    nav.setAttribute('aria-expanded', 'true');
    return;
  }
  nav.setAttribute('aria-expanded', navState);
}
/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const swapIcon = block.querySelector('.icon-search img');
  swapIcon.src = '../../icons/swap-vert.svg';

  const userWrapper = document.createElement('div');
  userWrapper.classList.add('user-wrapper', 'hide');

  const settingImg = document.createElement('img');
  settingImg.src = '../../icons/settings.svg';
  userWrapper.appendChild(settingImg);

  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  const userName = document.createElement('span');
  userName.innerText = 'Ella Jones';
  userInfo.appendChild(userName);

  const userPhoto = document.createElement('img');
  userPhoto.src = 'https://einfosoft.com/templates/admin/kuber/source/dark/assets/images/user/admin.jpg';
  userInfo.appendChild(userPhoto);

  userWrapper.appendChild(userInfo);
  block.querySelector('.nav-wrapper').appendChild(userWrapper);

  const menuWrap = document.createElement('div');
  menuWrap.className = 'menu-wrap';
  menuWrap.appendChild(block.querySelector('.nav-hamburger'));
  menuWrap.appendChild(block.querySelector('.nav-brand'));
  menuWrap.appendChild(block.querySelector('.nav-tools'));

  document.getElementById('nav').prepend(menuWrap);

  // implementing the swap-vert functionality
  block.querySelector('.nav-tools').addEventListener('click', (e) => {
    userWrapper.classList.toggle('hide');
 

  });

  const admin = document.createElement('div');
  admin.className = 'admin';
  navSections.querySelector('.default-content-wrapper').prepend(admin);
  admin.innerHTML = `
  <img src="https://einfosoft.com/templates/admin/kuber/source/dark/assets/images/user/admin.jpg"/>
  <p class="user-name">Ella Jones</p> 
  <p class="user-title">Admin</p> 
 
  `;

  navSections.querySelectorAll('ul li').forEach((li) => {
    li.addEventListener('click', () => {
      document.querySelectorAll('ul li').forEach((item) => item.classList.remove('active'));

      this.classList.add('active');
    });
  });

  //  window.addEventListener("load",changeMenuStructure);

  window.addEventListener('resize', () => {
    changeMenuStructure(block);
  });

  //  window.addEventListener('resize',debounce(changeMenuStructure,300));

  changeMenuStructure(block);

  // implementing theme functionality
  createThemeBox(block);

  listenEvents(block);
  
  setTheme();
  setNavState(nav);
}
