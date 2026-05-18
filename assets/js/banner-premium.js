document.addEventListener('DOMContentLoaded', function() {
    const rainContainer = document.getElementById('rainContainer');
    if (rainContainer) {
        const dropCount = 30;
        for (let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'water-drop';
            
            // Randomize position and animation
            const left = Math.random() * 100;
            const duration = 1 + Math.random() * 2;
            const delay = Math.random() * 5;
            
            drop.style.left = `${left}%`;
            drop.style.animationDuration = `${duration}s`;
            drop.style.animationDelay = `${delay}s`;
            
            rainContainer.appendChild(drop);
        }
    }

    // FAQ Toggle Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
                
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });
});
