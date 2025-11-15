// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initMap();
    initSocialLinks();
});

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            submitContactForm(this);
        }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateContactForm() {
    const form = document.getElementById('contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'این فیلد اجباری است');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'لطفا یک ایمیل معتبر وارد کنید');
            return false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
            showFieldError(field, 'لطفا یک شماره تماس معتبر وارد کنید');
            return false;
        }
    }
    
    // Clear any existing error
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    clearFieldError(field);
    
    // Add new error message
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function submitContactForm(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, you would send the data to your server
        console.log('Form data:', Object.fromEntries(formData));
        
        showNotification('پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }, 2000);
}

// Map initialization
function initMap() {
    // This is a placeholder for Google Maps integration
    // In a real implementation, you would initialize Google Maps here
    
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Add interactive functionality to the map placeholder
    mapElement.addEventListener('click', function() {
        // Open Google Maps in a new tab
        window.open('https://www.google.com/maps?q=تهران+خیابان+ولیعصر', '_blank');
    });
    
    mapElement.style.cursor = 'pointer';
}

// Social links interaction
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList[1]; // instagram, telegram, etc.
            
            // Simulate social media links
            const urls = {
                instagram: 'https://instagram.com/vipfitness',
                telegram: 'https://t.me/vipfitness',
                whatsapp: 'https://wa.me/989121234567',
                youtube: 'https://youtube.com/vipfitness'
            };
            
            if (urls[platform]) {
                window.open(urls[platform], '_blank');
            }
        });
    });
}

// Add CSS for contact page specific styles
const contactStyles = `
    .contact-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-bottom: 50px;
    }
    
    .contact-card {
        background: var(--card-bg-light);
        padding: 30px;
        border-radius: var(--border-radius);
        text-align: center;
        box-shadow: var(--shadow-light);
        transition: var(--transition);
    }
    
    .contact-card:hover {
        transform: translateY(-5px);
    }
    
    .contact-icon {
        width: 60px;
        height: 60px;
        background: var(--gold-gradient);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 1.5rem;
        color: white;
    }
    
    .contact-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 50px;
    }
    
    .contact-form-section {
        background: white;
        padding: 40px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-light);
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text-dark);
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-family: 'Vazirmatn', sans-serif;
        transition: var(--transition);
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #E63946;
    }
    
    .field-error {
        display: block;
        color: #E63946;
        font-size: 0.8rem;
        margin-top: 5px;
    }
    
    .map-section {
        margin-bottom: 30px;
    }
    
    .map-container {
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow-light);
    }
    
    .map-placeholder {
        height: 300px;
        background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
    }
    
    .map-fallback i {
        font-size: 3rem;
        margin-bottom: 15px;
    }
    
    .social-links-large {
        display: grid;
        gap: 15px;
    }
    
    .social-link {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        background: var(--card-bg-light);
        border-radius: var(--border-radius);
        text-decoration: none;
        color: var(--text-dark);
        transition: var(--transition);
        gap: 15px;
    }
    
    .social-link:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-light);
    }
    
    .social-link.instagram { border-right: 4px solid #E4405F; }
    .social-link.telegram { border-right: 4px solid #0088cc; }
    .social-link.whatsapp { border-right: 4px solid #25D366; }
    .social-link.youtube { border-right: 4px solid #FF0000; }
    
    .faq-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
    }
    
    .faq-item {
        background: var(--card-bg-light);
        padding: 30px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-light);
    }
    
    .faq-item h3 {
        color: var(--secondary-color);
        margin-bottom: 15px;
    }
    
    @media (max-width: 768px) {
        .contact-layout {
            grid-template-columns: 1fr;
            gap: 30px;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .contact-cards {
            grid-template-columns: 1fr;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = contactStyles;
document.head.appendChild(styleSheet);