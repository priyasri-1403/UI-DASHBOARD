export default function decorate(block) {
  const projectData = {
    name: 'Panasonic',
    description: 'Panasonic is a Japanese multinational electronics company Panasonic is a Japanese multinational electronics companyPanasonic is a Japanese multinational electronics companyPanasonic is a Japanese multinational electronics companyPanasonic is a Japanese multinational electronics company',
    currentStatus: 'red',
    overallStatus: 'amber'
  };

  block.innerHTML = `
    <div class="project-title-container">
      <div class="project-header-wrapper">
        <div class="project-info">
          <h1 class="project-title">${projectData.name}</h1>
          <p class="project-description">${projectData.description}</p>
        </div>
        <div class="status-columns">
          <div class="project-status-wrapper status-${projectData.currentStatus}">
            <div class="status-column">
              <div class="status-icon"></div>
              <div class="status-content">
                <div class="status-heading">Current Status</div>
                <span class="current-status-label"></span>
              </div>
            </div>
          </div>
          <div class="project-status-wrapper status-${projectData.overallStatus}">
            <div class="status-column">
              <div class="status-icon"></div>
              <div class="status-content">
                <div class="status-heading">Overall Status</div>
                <span class="overall-status-label"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Set current status label
  const currentStatusLabel = block.querySelector('.current-status-label');
  setStatusLabel(currentStatusLabel, projectData.currentStatus);
  
  // Set overall status label
  const overallStatusLabel = block.querySelector('.overall-status-label');
  setStatusLabel(overallStatusLabel, projectData.overallStatus);
}

// Helper function to set status label text
function setStatusLabel(labelElement, status) {
  switch(status) {
    case 'red':
      labelElement.textContent = 'At Risk';
      break;
    case 'amber':
      labelElement.textContent = 'Needs Attention';
      break;
    case 'green':
      labelElement.textContent = 'On Track';
      break;
    default:
      labelElement.textContent = 'Status Unknown';
  }
}

