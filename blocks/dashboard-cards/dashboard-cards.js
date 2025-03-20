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
            value: '154',
            trend: '4% Since last month',
            trendPositive: true,
            showTrend: true
        },
        {
            title: 'Region',
            value: '524',
            showTrend: false
        },
        {
            title: 'Deadline',
            value: '$2,453',
            showTrend: false
        }
    ];

    // Create cards from sample data
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
        
        // Create progress bar
        const progress = document.createElement('div');
        progress.classList.add('card-progress');
        const progressFill = document.createElement('div');
        progressFill.classList.add('card-progress-fill');
        progress.appendChild(progressFill);
        
        // Create footer with trend info - only for cards with showTrend=true
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
        
        // Create background image (the faded icon)
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
        card.appendChild(progress);
        if (footer) card.appendChild(footer);
        card.appendChild(bgImage);
        
        cardsContainer.appendChild(card);
    });

    // Replace block content with our cards container
    block.textContent = '';
    block.appendChild(cardsContainer);
}