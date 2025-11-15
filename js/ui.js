// UI interactions and animations for VIP Fitness website

document.addEventListener('DOMContentLoaded', function() {
    initFormValidation();
    initImageLazyLoading();
    initRippleEffects();
    initScrollAnimations();
});

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                    highlightError(input);
                } else {
                    removeError(input);
                }
            });
            
            if (isValid) {
                // Form is valid, proceed with submission
                handleFormSubmission(this);
            }
        });
        
        // Real-time validation on input change
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required')) {
                    if (!validateField(this)) {
                        highlightError(this);
                    } else {
                        removeError(this);
                    }
                }
            });
        });
    });
}

// Validate individual form field
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    
    if (value === '') {
        return false;
    }
    
    if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }
    
    if (type === 'tel') {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
    }
    
    if (field.hasAttribute('minlength')) {
        const minLength = parseInt(field.getAttribute('minlength'));
        return value.length >= minLength;
    }
    
    return true;
}

// Highlight field with error
function highlightError(field) {
    field.classList.add('error');
    
    // Add error message if not exists
    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
        const errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        
        if (field.type === 'email') {
            errorMessage.textContent = 'لطفا یک ایمیل معتبر وارد کنید';
        } else if (field.value === '') {
            errorMessage.textContent = 'این فیلد اجباری است';
        } else {
            errorMessage.textContent = 'مقدار وارد شده معتبر نیست';
        }
        
        field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
}

// Remove error highlighting
function removeError(field) {
    field.classList.remove('error');
    
    // Remove error message if exists
    const errorMessage = field.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.remove();
    }
}

// Handle form submission
function handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'در حال ارسال...';
    
    // Simulate form submission (replace with actual AJAX call)
    setTimeout(() => {
        showNotification('فرم با موفقیت ارسال شد', 'success');
        form.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }, 2000);
}

// Image Lazy Loading
function initImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Ripple Effect for Buttons
function initRippleEffects() {
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.btn, .card, .service-card');
        
        if (button) {
            createRipple(e, button);
        }
    });
}

// Create ripple effect
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - (element.getBoundingClientRect().left + radius)}px`;
    ripple.style.top = `${event.clientY - (element.getBoundingClientRect().top + radius)}px`;
    ripple.classList.add('ripple');
    
    const existingRipple = element.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Scroll Animations
function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.service-card, .testimonial-content, .section-header').forEach(el => {
            fadeObserver.observe(el);
        });
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .fade-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .btn, .card, .service-card {
        position: relative;
        overflow: hidden;
    }
    
    input.error, textarea.error, select.error {
        border-color: #E63946 !important;
    }
    
    .error-message {
        display: block;
        color: #E63946;
        font-size: 0.8rem;
        margin-top: 5px;
    }
`;
document.head.appendChild(style);