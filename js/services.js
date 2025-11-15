// Services page functionality
document.addEventListener('DOMContentLoaded', function() {
    initServiceTabs();
    initFAQAccordion();
    initPriceCardInteractions();
});

// Service tabs functionality
function initServiceTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// FAQ accordion functionality
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Price card interactions
function initPriceCardInteractions() {
    const priceCards = document.querySelectorAll('.price-card');
    
    priceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Add click event for selecting package
        const selectBtn = card.querySelector('.btn');
        selectBtn.addEventListener('click', function() {
            const packageName = card.querySelector('h3').textContent;
            showNotification(`پکیج ${packageName} به سبد خرید اضافه شد`, 'success');
            
            // Simulate adding to cart
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 1500);
        });
    });
}