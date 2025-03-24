export default function decorate(block) {
    const cardData = [
        {
            title: 'Region',
            value: 'India',
            icon: '/icons/home.svg',
            showTrend: false
        },
        {
            title: 'Revenue',
            value: '$2453',
            icon: '/icons/revenue.svg',
            trend: '4% Since last month',
            trendPositive: true,
            showTrend: true
        },
        {
            title: 'Start Date',
            value: '10/01/2025',
            icon: '/icons/employee.svg',
            showTrend: false
        },
        {
            title: 'Release Date',
            value: '25/03/2025',
            icon: '/icons/project.svg',
            showTrend: false,
            showProgress: true
        }
    ];

    let cardsHTML = '<div class="dashboard-cards-container">';
    
    cardData.forEach((data) => {
        cardsHTML += `
            <div class="dashboard-card">
                <div class="card-title">${data.title}</div>
                <div class="card-value">${data.value}</div>
                ${data.showProgress ? '<div class="card-progress"><div class="card-progress-fill"></div></div>' : ''}
                ${data.showTrend ? `
                    <div class="card-footer">
                        <span class="card-trend-icon">${data.trendPositive ? '&uarr;' : '&darr;'}</span>
                        <span class="card-trend">${data.trend}</span>
                    </div>
                ` : ''}
                <div class="card-background-image">
                    <img src="${data.icon}" alt="${data.title} icon">
                </div>
            </div>
        `;
    });
    
    cardsHTML += '</div>';
    
    // Replace block content with our cards container
    block.innerHTML = cardsHTML;
}