// Shop page functionality
class ShopManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 9;
        this.currentView = 'grid';
        this.filters = {
            category: 'all',
            price: 'all',
            brand: 'all',
            sort: 'default',
            search: ''
        };
        
        this.init();
    }
    
    async init() {
        await this.loadProducts();
        this.applyFilters();
        this.initEventListeners();
    }
    
    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            const data = await response.json();
            this.products = data.products;
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = this.getFallbackProducts();
        }
    }
    
    getFallbackProducts() {
        return [
            {
                id: "1",
                name: "پروتئین وی ایزوله",
                category: "پروتئین",
                brand: "Optimum Nutrition",
                price: 350000,
                originalPrice: 420000,
                image: "images/products/protein.jpg",
                description: "پروتئین وی ایزوله با بالاترین کیفیت و خلوص، مناسب برای عضله سازی و ریکاوری",
                features: ["خلوص بالا", "جذب سریع", "طعم عالی"],
                inStock: true,
                rating: 4.8,
                reviewCount: 124,
                weight: "2.27 kg",
                flavors: ["شکلات", "وانیل", "توت فرنگی"]
            },
            {
                id: "2",
                name: "کراتین مونوهیدرات",
                category: "کراتین",
                brand: "MuscleTech",
                price: 180000,
                originalPrice: 220000,
                image: "images/products/creatine.jpg",
                description: "کراتین مونوهیدرات خالص برای افزایش قدرت و حجم عضلانی",
                features: ["خلوص 99%", "بدون افزودنی", "موثرترین فرم کراتین"],
                inStock: true,
                rating: 4.7,
                reviewCount: 89,
                weight: "500 g",
                flavors: ["بدون طعم"]
            },
            {
                id: "3",
                name: "BCAA پودری",
                category: "آمینو اسید",
                brand: "Dymatize",
                price: 220000,
                originalPrice: 280000,
                image: "images/products/bcaa.jpg",
                description: "آمینو اسیدهای شاخه دار با نسبت 2:1:1 برای جلوگیری از کاتابولیسم عضلات",
                features: ["نسبت ایده آل", "حلالیت بالا", "طعم های متنوع"],
                inStock: true,
                rating: 4.6,
                reviewCount: 67,
                weight: "400 g",
                flavors: ["آب هندوانه", "بلوبری", "لیموناد"]
            },
            {
                id: "4",
                name: "گلوتامین",
                category: "آمینو اسید",
                brand: "Optimum Nutrition",
                price: 150000,
                originalPrice: 190000,
                image: "images/products/glutamine.jpg",
                description: "گلوتامین پودری برای بهبود ریکاوری و تقویت سیستم ایمنی",
                features: ["ریکاوری سریع", "تقویت ایمنی", "بدون طعم"],
                inStock: true,
                rating: 4.5,
                reviewCount: 45,
                weight: "500 g",
                flavors: ["بدون طعم"]
            },
            {
                id: "5",
                name: "پروتئین کازیین",
                category: "پروتئین",
                brand: "Dymatize",
                price: 320000,
                originalPrice: 380000,
                image: "images/products/casein.jpg",
                description: "پروتئین کازیین با جذب آهسته، مناسب برای مصرف قبل از خواب",
                features: ["جذب آهسته", "سیری طولانی", "طعم شکلات"],
                inStock: true,
                rating: 4.7,
                reviewCount: 78,
                weight: "1.8 kg",
                flavors: ["شکلات", "کره بادام زمینی"]
            },
            {
                id: "6",
                name: "پری ورک اوت",
                category: "انرژی زا",
                brand: "Cellucor",
                price: 120000,
                originalPrice: 150000,
                image: "images/products/preworkout.jpg",
                description: "مکمل قبل از تمرین برای افزایش انرژی، تمرکز و پمپ خون",
                features: ["انرژی فوری", "پمپ عالی", "بدون کافئین"],
                inStock: false,
                rating: 4.4,
                reviewCount: 112,
                weight: "300 g",
                flavors: ["بلوبری", "آب هندوانه"]
            }
        ];
    }
    
    initEventListeners() {
        // Filter changes
        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('price-filter').addEventListener('change', (e) => {
            this.filters.price = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('brand-filter').addEventListener('change', (e) => {
            this.filters.brand = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('sort-filter').addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.applyFilters();
        });
        
        // Search functionality
        document.getElementById('product-search').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
        // View options
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.getAttribute('data-view');
                this.renderProducts();
            });
        });
        
        // Modal events
        this.initModalEvents();
    }
    
    initModalEvents() {
        const modal = document.getElementById('quick-view-modal');
        const closeBtn = modal.querySelector('.close-modal');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.category !== 'all' && product.category !== this.filters.category) {
                return false;
            }
            
            // Brand filter
            if (this.filters.brand !== 'all' && product.brand !== this.filters.brand) {
                return false;
            }
            
            // Price filter
            if (this.filters.price !== 'all') {
                const [min, max] = this.filters.price.split('-').map(Number);
                if (product.price < min || product.price > max) {
                    return false;
                }
            }
            
            // Search filter
            if (this.filters.search && 
                !product.name.toLowerCase().includes(this.filters.search) &&
                !product.description.toLowerCase().includes(this.filters.search) &&
                !product.brand.toLowerCase().includes(this.filters.search)) {
                return false;
            }
            
            return true;
        });
        
        // Sort products
        this.sortProducts();
        
        // Reset to first page
        this.currentPage = 1;
        
        // Update UI
        this.renderProducts();
        this.renderPagination();
        this.updateProductsCount();
    }
    
    sortProducts() {
        switch (this.filters.sort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Default sorting (by ID or as they come)
                break;
        }
    }
    
    renderProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;
        
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
        
        if (productsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>محصولی یافت نشد</h3>
                    <p>هیچ محصولی با فیلترهای انتخاب شده مطابقت ندارد</p>
                    <button class="btn btn-primary" onclick="shopManager.resetFilters()">
                        بازنشانی فیلترها
                    </button>
                </div>
            `;
            return;
        }
        
        if (this.currentView === 'grid') {
            container.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        } else {
            container.innerHTML = productsToShow.map(product => this.createProductListItem(product)).join('');
        }
        
        this.attachProductEventListeners();
    }
    
    createProductCard(product) {
        const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${!product.inStock ? '<div class="out-of-stock">ناموجود</div>' : ''}
                    ${discount > 0 ? `<div class="discount-badge">${discount}%</div>` : ''}
                    <div class="product-actions">
                        <button class="action-btn quick-view" data-product-id="${product.id}" title="مشاهده سریع">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn add-to-wishlist" data-product-id="${product.id}" title="افزودن به علاقه‌مندی‌ها">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-content">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-brand">برند: ${product.brand}</p>
                    
                    <div class="product-rating">
                        <div class="stars">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>
                    
                    <div class="product-price">
                        ${product.originalPrice ? `
                            <span class="original-price">${this.formatPrice(product.originalPrice)}</span>
                        ` : ''}
                        <span class="current-price">${this.formatPrice(product.price)} تومان</span>
                    </div>
                    
                    <button class="btn btn-primary add-to-cart ${!product.inStock ? 'disabled' : ''}" 
                            data-product-id="${product.id}" 
                            ${!product.inStock ? 'disabled' : ''}>
                        ${!product.inStock ? 'ناموجود' : 'افزودن به سبد'}
                    </button>
                </div>
            </div>
        `;
    }
    
    createProductListItem(product) {
        const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        return `
            <div class="product-list-item" data-product-id="${product.id}">
                <div class="product-list-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${!product.inStock ? '<div class="out-of-stock">ناموجود</div>' : ''}
                </div>
                
                <div class="product-list-content">
                    <div class="product-list-header">
                        <div>
                            <div class="product-category">${product.category}</div>
                            <h3 class="product-title">${product.name}</h3>
                            <p class="product-brand">برند: ${product.brand}</p>
                        </div>
                        
                        <div class="product-list-price">
                            ${product.originalPrice ? `
                                <span class="original-price">${this.formatPrice(product.originalPrice)}</span>
                            ` : ''}
                            <span class="current-price">${this.formatPrice(product.price)} تومان</span>
                            ${discount > 0 ? `<span class="discount-badge">${discount}%</span>` : ''}
                        </div>
                    </div>
                    
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-features">
                        ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                    
                    <div class="product-list-footer">
                        <div class="product-rating">
                            <div class="stars">
                                ${this.generateStars(product.rating)}
                            </div>
                            <span class="rating-count">(${product.reviewCount} نظر)</span>
                        </div>
                        
                        <div class="product-list-actions">
                            <button class="btn btn-outline quick-view" data-product-id="${product.id}">
                                مشاهده سریع
                            </button>
                            <button class="btn btn-primary add-to-cart ${!product.inStock ? 'disabled' : ''}" 
                                    data-product-id="${product.id}" 
                                    ${!product.inStock ? 'disabled' : ''}>
                                ${!product.inStock ? 'ناموجود' : 'افزودن به سبد'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    attachProductEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                this.addToCart(productId);
            });
        });
        
        // Quick view buttons
        document.querySelectorAll('.quick-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.quick-view').getAttribute('data-product-id');
                this.showQuickView(productId);
            });
        });
        
        // Wishlist buttons
        document.querySelectorAll('.add-to-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.add-to-wishlist').getAttribute('data-product-id');
                this.addToWishlist(productId);
            });
        });
    }
    
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) return;
        
        if (window.cart) {
            window.cart.addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category
            });
            
            // Add flying animation
            this.createFlyAnimation(productId);
        }
    }
    
    createFlyAnimation(productId) {
        const btn = document.querySelector(`[data-product-id="${productId}"].add-to-cart`);
        const cartIcon = document.querySelector('.cart-icon');
        
        if (!btn || !cartIcon) return;
        
        const btnRect = btn.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        
        const flyingItem = document.createElement('div');
        flyingItem.className = 'flying-item';
        flyingItem.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            border-radius: 50%;
            z-index: 10000;
            left: ${btnRect.left + btnRect.width / 2}px;
            top: ${btnRect.top + btnRect.height / 2}px;
            pointer-events: none;
        `;
        
        document.body.appendChild(flyingItem);
        
        // Animate to cart
        flyingItem.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${cartRect.left - btnRect.left}px, ${cartRect.top - btnRect.top}px) scale(0.5)`,
                opacity: 0
            }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
        });
        
        setTimeout(() => {
            flyingItem.remove();
        }, 800);
    }
    
    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.getElementById('quick-view-modal');
        const content = document.getElementById('quick-view-content');
        
        content.innerHTML = `
            <div class="quick-view-content">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-details">
                    <h2>${product.name}</h2>
                    <div class="quick-view-meta">
                        <span class="category">${product.category}</span>
                        <span class="brand">برند: ${product.brand}</span>
                    </div>
                    
                    <div class="quick-view-rating">
                        <div class="stars">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="rating-count">${product.reviewCount} نظر</span>
                    </div>
                    
                    <p class="quick-view-description">${product.description}</p>
                    
                    <div class="quick-view-features">
                        <h4>ویژگی‌ها:</h4>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="quick-view-price">
                        ${product.originalPrice ? `
                            <span class="original-price">${this.formatPrice(product.originalPrice)}</span>
                        ` : ''}
                        <span class="current-price">${this.formatPrice(product.price)} تومان</span>
                    </div>
                    
                    <div class="quick-view-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn decrease">-</button>
                            <span class="quantity">1</span>
                            <button class="quantity-btn increase">+</button>
                        </div>
                        <button class="btn btn-primary add-to-cart-quick" data-product-id="${product.id}">
                            افزودن به سبد خرید
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners for quantity and add to cart
        const quantityElement = content.querySelector('.quantity');
        const decreaseBtn = content.querySelector('.decrease');
        const increaseBtn = content.querySelector('.increase');
        const addToCartBtn = content.querySelector('.add-to-cart-quick');
        
        let quantity = 1;
        
        decreaseBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            quantity++;
            quantityElement.textContent = quantity;
        });
        
        addToCartBtn.addEventListener('click', () => {
            for (let i = 0; i < quantity; i++) {
                this.addToCart(productId);
            }
            modal.style.display = 'none';
        });
        
        modal.style.display = 'block';
    }
    
    addToWishlist(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        if (!wishlist.find(item => item.id === productId)) {
            wishlist.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            });
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            showNotification('محصول به علاقه‌مندی‌ها اضافه شد', 'success');
        } else {
            showNotification('این محصول قبلاً به علاقه‌مندی‌ها اضافه شده', 'warning');
        }
    }
    
    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const pagination = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="page-btn prev" data-page="${this.currentPage - 1}">قبلی</button>`;
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<span class="page-btn active">${i}</span>`;
            } else {
                paginationHTML += `<button class="page-btn" data-page="${i}">${i}</button>`;
            }
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="page-btn next" data-page="${this.currentPage + 1}">بعدی</button>`;
        }
        
        pagination.innerHTML = paginationHTML;
        
        // Add event listeners to page buttons
        pagination.querySelectorAll('.page-btn:not(.active)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPage = parseInt(e.target.getAttribute('data-page'));
                this.renderProducts();
                this.renderPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }
    
    updateProductsCount() {
        const countElement = document.querySelector('.products-count');
        if (countElement) {
            countElement.textContent = `همه محصولات (${this.filteredProducts.length} محصول)`;
        }
    }
    
    resetFilters() {
        document.getElementById('category-filter').value = 'all';
        document.getElementById('price-filter').value = 'all';
        document.getElementById('brand-filter').value = 'all';
        document.getElementById('sort-filter').value = 'default';
        document.getElementById('product-search').value = '';
        
        this.filters = {
            category: 'all',
            price: 'all',
            brand: 'all',
            sort: 'default',
            search: ''
        };
        
        this.applyFilters();
    }
    
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(price);
    }
}

// Initialize shop manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.shopManager = new ShopManager();
});