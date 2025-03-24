export default function decorate(block) {
  const statsContainer = document.createElement('div');
  statsContainer.classList.add('dashboard-stats-container');
  
  // Create card data based on the image
  const statsData = [
    {
      title: 'New Projects',
      value: '102',
      class: 'new-projects',
      change: '+10% Since last month',
      isPositive: true
    },
    {
      title: 'New Customers',
      value: '154',
      class: 'new-customers',
      change: '+4% Since last month',
      isPositive: true
    },
    {
      title: 'Inquiry',
      value: '524',
      class: 'inquiry',
      change: '+23% Since last month',
      isPositive: true
    },
    {
      title: 'Earning',
      value: '$2,453',
      class: 'earning',
      change: '-6% Since last month',
      isPositive: false
    }
  ];
  
  // Create cards from data
  statsData.forEach(stat => {
    const card = document.createElement('div');
    card.classList.add('stat-card', stat.class);
    
    // Title
    const title = document.createElement('h3');
    title.classList.add('stat-card-title');
    title.textContent = stat.title;
    
    // Value
    const value = document.createElement('div');
    value.classList.add('stat-card-value');
    value.textContent = stat.value;
    
    // Progress bar
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('stat-card-progress');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressContainer.appendChild(progressBar);
    
    // Change percentage
    const change = document.createElement('div');
    change.classList.add('stat-card-change');
    
    // Arrow icon based on positive/negative change
    const changeIcon = document.createElement('span');
    changeIcon.classList.add('stat-card-change-icon');
    changeIcon.innerHTML = stat.isPositive ? '↑' : '↓';
    
    const changeText = document.createTextNode(stat.change);
    change.appendChild(changeIcon);
    change.appendChild(changeText);
    
    // Add background icon (optional)
    const bgIcon = document.createElement('div');
    bgIcon.classList.add('stat-card-bg-icon');
    
    // Append all elements to card
    card.appendChild(title);
    card.appendChild(value);
    card.appendChild(progressContainer);
    card.appendChild(change);
    card.appendChild(bgIcon);
    
    // Add card to container
    statsContainer.appendChild(card);
  });
  
  // Replace block content with our stats container
  block.textContent = '';
  block.appendChild(statsContainer);
} 