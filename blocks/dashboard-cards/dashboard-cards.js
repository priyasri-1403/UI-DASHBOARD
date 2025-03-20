export default function decorate(block) {
    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('dashboard-cards-container');
    const allIcons = block.querySelectorAll('.icon img');
    
        allIcons.forEach((icon) => {
            const card = document.createElement('div');
            card.classList.add('dashboard-card');
            
            // Create icon container
            const iconContainer = document.createElement('div');
            iconContainer.classList.add('card-icon');
            const iconClone = icon.cloneNode(true);
            iconContainer.appendChild(iconClone);
            card.appendChild(iconContainer);
            
            // Add card to container
            cardsContainer.appendChild(card);
        });
    // Replace block content with our cards container
    block.textContent = '';
    block.appendChild(cardsContainer);
}