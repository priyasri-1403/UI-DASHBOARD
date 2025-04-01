export default function decorate(block) {
  const projectData = {
    name: 'Panasonic',
    description: 'Panasonic is a Japanese multinational electronics company',
    status: 'red' // Can be 'red', 'amber', or 'green'
  };

  block.innerHTML = `
    <div class="project-title-container">
      <div class="project-header-wrapper">
        <div class="project-info">
          <h1 class="project-title">${projectData.name}</h1>
          <p class="project-description">${projectData.description}</p>
        </div>
        <div class="project-status-wrapper status-${projectData.status}">
          <div class="status-indicator status-${projectData.status}"></div>
          <span class="status-label"></span>
        </div>
      </div>
    </div>
  `;

  const statusLabel = block.querySelector('.status-label');
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
}

