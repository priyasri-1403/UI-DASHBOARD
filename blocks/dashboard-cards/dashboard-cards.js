export default function decorate(block) {
    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('dashboard-cards-container');

    // Get all icon elements from the block
    const allIcons = block.querySelectorAll('.icon img');
    const iconElements = Array.from(allIcons);

    // Sample data for dashboard cards
    const cardData = [
        {
            title: 'Team',
            value: '102',
            showTrend: false
        },
        {
            title: 'Revenue',
            value: '$2453',
            trend: '4% Since last month',
            trendPositive: true,
            showTrend: true
        },
        {
            title: 'Region',
            value: 'India',
            showTrend: false
        },
        {
            title: 'Deadline',
            value: '25/03/2025',
            showTrend: false
        }
    ];

    cardData.forEach((data, index) => {
        const card = document.createElement('div');
        card.classList.add('dashboard-card');
        
        // Create card title
        const title = document.createElement('div');
        title.classList.add('card-title');
        title.textContent = data.title;
        
        // Create card value
        const value = document.createElement('div');
        value.classList.add('card-value');
        value.textContent = data.value;
        
        let progress;
        if (data.title === 'Deadline') {
            progress = document.createElement('div');
            progress.classList.add('card-progress');
            const progressFill = document.createElement('div');
            progressFill.classList.add('card-progress-fill');
            progress.appendChild(progressFill);
        }
        
        let footer;
        if (data.showTrend) {
            footer = document.createElement('div');
            footer.classList.add('card-footer');
            
            const trendIcon = document.createElement('span');
            trendIcon.classList.add('card-trend-icon');
            trendIcon.innerHTML = data.trendPositive ? '&uarr;' : '&darr;';
            
            const trendText = document.createElement('span');
            trendText.classList.add('card-trend');
            trendText.textContent = data.trend;
            
            footer.appendChild(trendIcon);
            footer.appendChild(trendText);
        }
        
        const bgImage = document.createElement('div');
        bgImage.classList.add('card-background-image');
        
        // Use the corresponding icon based on index, if available
        if (index < iconElements.length) {
            const iconClone = iconElements[index].cloneNode(true);
            bgImage.appendChild(iconClone);
        }
        
        // Assemble card in the correct order
        card.appendChild(title);
        card.appendChild(value);
        if (progress) card.appendChild(progress);
        if (footer) card.appendChild(footer);
        card.appendChild(bgImage);
        
        cardsContainer.appendChild(card);
    });

    // Replace block content with our cards container
    block.textContent = '';
    block.appendChild(cardsContainer);
}