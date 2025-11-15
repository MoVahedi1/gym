// Cart functionality for VIP Fitness website

// Cart class to manage shopping cart operations
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartDisplay();
    }
    
    // Load cart from localStorage
    loadCart() {
        const cartData = localStorage.getItem('cart');
        return cartData ? JSON.parse(cartData) : [];
    }
    
    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartDisplay();
    }
    
    // Add item to cart
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showAddToCartAnimation();
        showNotification('محصول به سبد خرید اضافه شد', 'success');
    }
    
    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        showNotification('محصول از سبد خرید حذف شد', 'success');
    }
    
    // Update item quantity
    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }
        
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
        }
    }
    
    // Get total items count
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Get total price
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
    }
    
    // Update cart display (counter, etc.)
    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }
        
        // Update cart page if exists
        if (document.querySelector('.cart-page')) {
            this.renderCartPage();
        }
    }
    
    // Show add to cart animation
    showAddToCartAnimation() {
        // This would create a flying animation from product to cart
        // Implementation depends on specific product card structure
    }
    
    // Render cart page
    renderCartPage() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalElement = document.querySelector('.cart-total');
        
        if (!cartItemsContainer) return;
        
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>سبد خرید شما خالی است</h3>
                    <p>برای مشاهده محصولات به فروشگاه مراجعه کنید</p>
                    <a href="shop.html" class="btn btn-primary">مشاهده فروشگاه</a>
                </div>
            `;
            if (cartTotalElement) cartTotalElement.textContent = '0';
            return;
        }
        
        let cartHTML = '';
        this.items.forEach(item => {
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">${formatNumber(item.price)} تومان</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-total">
                        ${formatNumber(item.price * item.quantity)} تومان
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        
        if (cartTotalElement) {
            cartTotalElement.textContent = formatNumber(this.getTotalPrice());
        }
        
        // Add event listeners for quantity buttons and remove buttons
        this.addCartEventListeners();
    }
    
    // Add event listeners for cart interactions
    addCartEventListeners() {
        // Decrease quantity buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });
        
        // Increase quantity buttons
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });
        
        // Remove item buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item-remove').getAttribute('data-id');
                this.removeItem(productId);
            });
        });
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new Cart();
    
    // Add to cart buttons event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const product = getProductById(productId);
            
            if (product) {
                window.cart.addItem(product);
            }
        });
    });
});

// Mock function to get product by ID (replace with actual data source)
function getProductById(id) {
    // This would typically fetch from products.json or an API
    const products = {
        '1': { id: '1', name: 'پروتئین وی ایزوله', price: 350000, image: 'images/products/protein.jpg' },
        '2': { id: '2', name: 'کراتین مونوهیدرات', price: 180000, image: 'images/products/creatine.jpg' },
        '3': { id: '3', name: 'BCAA پودری', price: 220000, image: 'images/products/bcaa.jpg' },
        '4': { id: '4', name: 'گلوتامین', price: 150000, image: 'images/products/glutamine.jpg' },
        '5': { id: '5', name: 'پروتئین کازیین', price: 320000, image: 'images/products/casein.jpg' },
        '6': { id: '6', name: 'پری ورک اوت', price: 120000, image: 'images/products/preworkout.jpg' }
    };
    
    return products[id];
}