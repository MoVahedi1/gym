// Checkout functionality
class CheckoutManager {
    constructor() {
        this.cart = [];
        this.shippingCost = 30000;
        this.discount = 0;
        this.orderData = {};
        
        this.init();
    }
    
    init() {
        this.loadCartItems();
        this.renderOrderSummary();
        this.initEventListeners();
        this.initFormValidation();
    }
    
    loadCartItems() {
        const cartData = localStorage.getItem('cart');
        this.cart = cartData ? JSON.parse(cartData) : [];
        
        if (this.cart.length === 0) {
            this.showEmptyCart();
        }
    }
    
    showEmptyCart() {
        const checkoutForm = document.querySelector('.checkout-form-section');
        if (checkoutForm) {
            checkoutForm.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>سبد خرید شما خالی است</h2>
                    <p>برای ادامه فرآیند خرید، ابتدا محصولاتی به سبد خرید خود اضافه کنید</p>
                    <a href="shop.html" class="btn btn-primary">مشاهده فروشگاه</a>
                </div>
            `;
        }
    }
    
    renderOrderSummary() {
        const orderItems = document.getElementById('order-items');
        const subtotalElement = document.getElementById('order-subtotal');
        const discountElement = document.getElementById('order-discount');
        const shippingElement = document.getElementById('order-shipping');
        const totalElement = document.getElementById('order-total');
        
        if (!orderItems) return;
        
        // Calculate totals
        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping();
        const total = subtotal - this.discount + shipping;
        
        // Render order items
        orderItems.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-meta">
                        <span class="item-quantity">${item.quantity} عدد</span>
                        <span class="item-price">${this.formatPrice(item.price * item.quantity)} تومان</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Update totals
        if (subtotalElement) subtotalElement.textContent = this.formatPrice(subtotal) + ' تومان';
        if (discountElement) discountElement.textContent = this.formatPrice(this.discount) + ' تومان';
        if (shippingElement) shippingElement.textContent = this.formatPrice(shipping) + ' تومان';
        if (totalElement) totalElement.textContent = this.formatPrice(total) + ' تومان';
    }
    
    calculateSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    calculateShipping() {
        const subtotal = this.calculateSubtotal();
        
        // Free shipping for orders over 500,000
        if (subtotal >= 500000) {
            return 0;
        }
        
        // Check selected shipping method
        const selectedShipping = document.querySelector('input[name="shipping_method"]:checked');
        if (selectedShipping) {
            switch (selectedShipping.value) {
                case 'express':
                    return 30000;
                case 'standard':
                    return 20000;
                case 'free':
                    return 0;
                default:
                    return this.shippingCost;
            }
        }
        
        return this.shippingCost;
    }
    
    initEventListeners() {
        // Shipping method change
        document.querySelectorAll('input[name="shipping_method"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.renderOrderSummary();
            });
        });
        
        // Province change (update cities)
        const provinceSelect = document.getElementById('province');
        if (provinceSelect) {
            provinceSelect.addEventListener('change', (e) => {
                this.updateCities(e.target.value);
            });
        }
        
        // Complete order button
        const completeOrderBtn = document.getElementById('complete-order');
        if (completeOrderBtn) {
            completeOrderBtn.addEventListener('click', () => {
                this.completeOrder();
            });
        }
        
        // Form input changes
        document.querySelectorAll('#shipping-form input, #shipping-form select').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }
    
    initFormValidation() {
        const form = document.getElementById('shipping-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
            });
        }
    }
    
    updateCities(province) {
        const citySelect = document.getElementById('city');
        if (!citySelect) return;
        
        const cities = {
            'tehran': ['تهران', 'شهریار', 'اسلامشهر', 'ری'],
            'alborz': [ 'کرج', 'هشتگرد', 'نظرآباد','ساوجبلاغ'],
            'isfahan': ['اصفهان', 'کاشان', 'خمینی شهر'],
            'fars': ['شیراز', 'مرودشت', 'کازرون'],
            'khorasan': ['مشهد', 'نیشابور', 'سبزوار']
        };
        
        citySelect.innerHTML = '<option value="">انتخاب شهر</option>';
        
        if (province && cities[province]) {
            cities[province].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        
        // Remove existing error
        this.clearFieldError(field);
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'این فیلد اجباری است');
            return false;
        }
        
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'ایمیل معتبر نیست');
            return false;
        }
        
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            this.showFieldError(field, 'شماره تماس معتبر نیست');
            return false;
        }
        
        if (field.id === 'postal_code' && value && !this.isValidPostalCode(value)) {
            this.showFieldError(field, 'کد پستی معتبر نیست');
            return false;
        }
        
        return true;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^09[0-9]{9}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }
    
    isValidPostalCode(postalCode) {
        const postalRegex = /^\d{10}$/;
        return postalRegex.test(postalCode.replace(/\D/g, ''));
    }
    
    validateForm() {
        const form = document.getElementById('shipping-form');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Check terms acceptance
        const termsCheckbox = document.getElementById('accept-terms');
        if (!termsCheckbox.checked) {
            showNotification('لطفاً قوانین و شرایط را بپذیرید', 'error');
            isValid = false;
        }
        
        return isValid;
    }
    
    async completeOrder() {
        if (!this.validateForm()) {
            return;
        }
        
        if (this.cart.length === 0) {
            showNotification('سبد خرید شما خالی است', 'error');
            return;
        }
        
        // Show payment modal
        this.showPaymentModal();
        
        // Simulate payment processing
        try {
            await this.processPayment();
            await this.createOrder();
            this.clearCart();
            this.redirectToSuccess();
        } catch (error) {
            this.showPaymentError(error.message);
        }
    }
    
    showPaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    hidePaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    processPayment() {
        return new Promise((resolve, reject) => {
            // Simulate payment processing
            setTimeout(() => {
                const isSuccess = Math.random() > 0.1; // 90% success rate
                
                if (isSuccess) {
                    resolve();
                } else {
                    reject(new Error('پرداخت ناموفق بود. لطفاً مجدداً تلاش کنید.'));
                }
            }, 3000);
        });
    }
    
    createOrder() {
        const formData = new FormData(document.getElementById('shipping-form'));
        const shippingMethod = document.querySelector('input[name="shipping_method"]:checked').value;
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
        
        const order = {
            id: this.generateOrderId(),
            items: this.cart,
            customer: {
                firstName: formData.get('first_name'),
                lastName: formData.get('last_name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                address: {
                    province: formData.get('province'),
                    city: formData.get('city'),
                    fullAddress: formData.get('address'),
                    postalCode: formData.get('postal_code')
                }
            },
            shipping: {
                method: shippingMethod,
                cost: this.calculateShipping()
            },
            payment: {
                method: paymentMethod,
                amount: this.calculateSubtotal() - this.discount + this.calculateShipping()
            },
            status: 'completed',
            createdAt: new Date().toISOString(),
            notes: document.getElementById('order_notes').value
        };
        
        // Save order to localStorage (in real app, send to server)
        this.saveOrder(order);
        
        return Promise.resolve(order);
    }
    
    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    clearCart() {
        localStorage.removeItem('cart');
        this.cart = [];
        
        // Update cart count in header
        if (window.cart) {
            window.cart.updateCartDisplay();
        }
    }
    
    redirectToSuccess() {
        setTimeout(() => {
            window.location.href = 'order-success.html';
        }, 1000);
    }
    
    showPaymentError(message) {
        this.hidePaymentModal();
        showNotification(message, 'error');
    }
    
    generateOrderId() {
        return 'ORD_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(price);
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.checkoutManager = new CheckoutManager();
    
    // Close modal when clicking X
    const closeModal = document.querySelector('.payment-modal .close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('payment-modal').style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('payment-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});