export default function decorate(block) {
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('project-title-container');

  const projectData = {
    name: 'Panasonic',
    description: 'Panasonic is a Japanese multinational electronics company'
  };
  
  // Create header wrapper
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('project-header-wrapper');
  
  // Create title element
  const titleElement = document.createElement('h1');
  titleElement.classList.add('project-title');
  titleElement.textContent = projectData.name;
  
  // Create subtitle element
  const subtitleElement = document.createElement('p');
  subtitleElement.classList.add('project-description');
  subtitleElement.textContent = projectData.description;
  
  // Assemble the components
  headerWrapper.appendChild(titleElement);
  headerWrapper.appendChild(subtitleElement);
  titleContainer.appendChild(headerWrapper);

  // Replace block content with our title container
  block.textContent = '';
  block.appendChild(titleContainer);
}

