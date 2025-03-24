export default function decorate(block) {
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('project-title-container');

  const projectData = {
    name: 'Panasonic',
    description: 'Panasonic is a Japanese multinational electronics company',
    status: 'red' // Can be 'red', 'amber', or 'green'
  };
  
  // Create header wrapper
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('project-header-wrapper');
  
  // Create project info section (title and description column)
  const projectInfo = document.createElement('div');
  projectInfo.classList.add('project-info');
  
  // Create title element
  const titleElement = document.createElement('h1');
  titleElement.classList.add('project-title');
  titleElement.textContent = projectData.name;
  
  // Create subtitle element
  const subtitleElement = document.createElement('p');
  subtitleElement.classList.add('project-description');
  subtitleElement.textContent = projectData.description;
  
  // Add title and description to project info section
  projectInfo.appendChild(titleElement);
  projectInfo.appendChild(subtitleElement);
  
  // Create status indicator
  const statusWrapper = document.createElement('div');
  statusWrapper.classList.add('project-status-wrapper', `status-${projectData.status}`);
  
  const statusIndicator = document.createElement('div');
  statusIndicator.classList.add('status-indicator', `status-${projectData.status}`);
  
  const statusLabel = document.createElement('span');
  statusLabel.classList.add('status-label');
  
  // Set the appropriate status text
  switch(projectData.status) {
    case 'red':
      statusLabel.textContent = 'At Risk';
      break;
    case 'amber':
      statusLabel.textContent = 'Needs Attention';
      break;
    case 'green':
      statusLabel.textContent = 'On Track';
      break;
    default:
      statusLabel.textContent = 'Status Unknown';
  }
  
  statusWrapper.appendChild(statusIndicator);
  statusWrapper.appendChild(statusLabel);
  
  // Assemble the components
  headerWrapper.appendChild(projectInfo);
  headerWrapper.appendChild(statusWrapper);
  titleContainer.appendChild(headerWrapper);

  // Replace block content with our title container
  block.textContent = '';
  block.appendChild(titleContainer);
}

