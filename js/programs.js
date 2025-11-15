// Programs page functionality
class ProgramsManager {
    constructor() {
        this.programs = [];
        this.filteredPrograms = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        
        this.init();
    }
    
    async init() {
        await this.loadPrograms();
        this.renderPrograms();
        this.initEventListeners();
    }
    
    async loadPrograms() {
        try {
            // In a real application, this would be an API call
            const response = await fetch('data/programs.json');
            this.programs = await response.json();
            this.filteredPrograms = [...this.programs];
        } catch (error) {
            console.error('Error loading programs:', error);
            // Fallback data
            this.programs = this.getFallbackPrograms();
            this.filteredPrograms = [...this.programs];
        }
    }
    
    getFallbackPrograms() {
        return [
            {
                id: 1,
                name: "برنامه چربی سوزی حرفه‌ای",
                type: "fat-loss",
                level: "beginner",
                duration: "12 هفته",
                price: 290000,
                image: "images/programs/fat-loss.jpg",
                description: "برنامه تخصصی کاهش وزن و چربی سوزی با تمرینات کاردیو و قدرتی",
                features: [
                    "برنامه تمرینی هفتگی",
                    "برنامه غذایی اختصاصی",
                    "پشتیبانی آنلاین",
                    "ارزیابی پیشرفت"
                ],
                workouts: [
                    {
                        day: "شنبه",
                        type: "کاردیو",
                        duration: "45 دقیقه",
                        exercises: ["دویدن", "طناب زدن", "الپتیکال"]
                    },
                    {
                        day: "یکشنبه",
                        type: "قدرتی بالا تنه",
                        duration: "60 دقیقه",
                        exercises: ["پرس سینه", "زیربغل", "سرشانه"]
                    }
                ]
            },
            {
                id: 2,
                name: "برنامه عضله سازی پیشرفته",
                type: "muscle-gain",
                level: "advanced",
                duration: "16 هفته",
                price: 350000,
                image: "images/programs/muscle-gain.jpg",
                description: "برنامه حرفه‌ای برای افزایش حجم عضلانی و قدرت",
                features: [
                    "برنامه تمرینی پیشرونده",
                    "برنامه غذایی پرپروتئین",
                    "مشاوره مکمل",
                    "آنالیز بدن"
                ]
            },
            {
                id: 3,
                name: "برنامه افزایش قدرت",
                type: "strength",
                level: "intermediate",
                duration: "8 هفته",
                price: 250000,
                image: "images/programs/strength.jpg",
                description: "برنامه تمرینی متمرکز بر افزایش قدرت عملکردی",
                features: [
                    "تمرینات compound",
                    "پیشرفت تدریجی",
                    "تمرینات functional",
                    "برنامه گرم کردن اختصاصی"
                ]
            },
            {
                id: 4,
                name: "برنامه فیتنس بانوان",
                type: "fat-loss",
                level: "beginner",
                duration: "10 هفته",
                price: 220000,
                image: "images/programs/womens-fitness.jpg",
                description: "برنامه تخصصی تناسب اندام برای بانوان",
                features: [
                    "تمرینات مخصوص بانوان",
                    "برنامه غذایی متعادل",
                    "تمرینات کگل",
                    "پشتیبانی ویژه"
                ]
            }
        ];
    }
    
    renderPrograms() {
        const container = document.getElementById('programs-container');
        if (!container) return;
        
        if (this.filteredPrograms.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>برنامه‌ای یافت نشد</h3>
                    <p>هیچ برنامه‌ای با فیلترهای انتخاب شده مطابقت ندارد</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredPrograms.map(program => `
            <div class="program-card" data-program-id="${program.id}">
                <div class="program-image">
                    <img src="${program.image}" alt="${program.name}">
                    <div class="program-badges">
                        <span class="badge type-${program.type}">${this.getTypeLabel(program.type)}</span>
                        <span class="badge level-${program.level}">${this.getLevelLabel(program.level)}</span>
                    </div>
                </div>
                
                <div class="program-content">
                    <h3 class="program-title">${program.name}</h3>
                    <p class="program-description">${program.description}</p>
                    
                    <div class="program-meta">
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${program.duration}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-dumbbell"></i>
                            <span>${program.workouts ? program.workouts.length + ' جلسه' : 'برنامه هفتگی'}</span>
                        </div>
                    </div>
                    
                    <div class="program-features">
                        ${program.features.slice(0, 3).map(feature => `
                            <span class="feature-tag">${feature}</span>
                        `).join('')}
                    </div>
                    
                    <div class="program-footer">
                        <div class="program-price">
                            <span class="price">${this.formatPrice(program.price)}</span>
                            <span class="price-unit">تومان</span>
                        </div>
                        <div class="program-actions">
                            <button class="btn btn-outline view-program" data-program-id="${program.id}">
                                مشاهده جزئیات
                            </button>
                            <button class="btn btn-primary add-to-cart" data-program-id="${program.id}">
                                افزودن به سبد
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.attachProgramEventListeners();
    }
    
    attachProgramEventListeners() {
        // View program details
        document.querySelectorAll('.view-program').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const programId = e.target.getAttribute('data-program-id');
                this.showProgramDetails(programId);
            });
        });
        
        // Add program to cart
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const programId = e.target.getAttribute('data-program-id');
                this.addProgramToCart(programId);
            });
        });
    }
    
    initEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentFilter = e.target.getAttribute('data-filter');
                this.applyFilters();
            });
        });
        
        // Search functionality
        const searchInput = document.getElementById('program-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
        
        // Modal close
        const modal = document.getElementById('program-modal');
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
        this.filteredPrograms = this.programs.filter(program => {
            // Apply type filter
            if (this.currentFilter !== 'all' && program.type !== this.currentFilter && program.level !== this.currentFilter) {
                return false;
            }
            
            // Apply search filter
            if (this.searchTerm && !program.name.toLowerCase().includes(this.searchTerm) && 
                !program.description.toLowerCase().includes(this.searchTerm)) {
                return false;
            }
            
            return true;
        });
        
        this.renderPrograms();
    }
    
    showProgramDetails(programId) {
        const program = this.programs.find(p => p.id == programId);
        if (!program) return;
        
        const modal = document.getElementById('program-modal');
        const detailsContainer = document.getElementById('program-details');
        
        detailsContainer.innerHTML = `
            <div class="program-detail">
                <div class="detail-header">
                    <div class="detail-image">
                        <img src="${program.image}" alt="${program.name}">
                    </div>
                    <div class="detail-info">
                        <h2>${program.name}</h2>
                        <p class="program-description">${program.description}</p>
                        
                        <div class="detail-meta">
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>مدت برنامه: ${program.duration}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-signal"></i>
                                <span>سطح: ${this.getLevelLabel(program.level)}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-dumbbell"></i>
                                <span>نوع: ${this.getTypeLabel(program.type)}</span>
                            </div>
                        </div>
                        
                        <div class="detail-price">
                            <span class="price">${this.formatPrice(program.price)}</span>
                            <span class="price-unit">تومان</span>
                        </div>
                        
                        <button class="btn btn-primary btn-large add-to-cart-detail" data-program-id="${program.id}">
                            افزودن به سبد خرید
                        </button>
                    </div>
                </div>
                
                <div class="detail-features">
                    <h3>ویژگی‌های برنامه</h3>
                    <div class="features-grid">
                        ${program.features.map(feature => `
                            <div class="feature-item">
                                <i class="fas fa-check"></i>
                                <span>${feature}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${program.workouts ? `
                <div class="workout-schedule">
                    <h3>برنامه هفتگی</h3>
                    <div class="workout-days">
                        ${program.workouts.map(workout => `
                            <div class="workout-day">
                                <h4>${workout.day}</h4>
                                <div class="workout-info">
                                    <span class="workout-type">${workout.type}</span>
                                    <span class="workout-duration">${workout.duration}</span>
                                </div>
                                <div class="workout-exercises">
                                    ${workout.exercises.map(exercise => `
                                        <span class="exercise-tag">${exercise}</span>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        // Add event listener for add to cart button in modal
        const addToCartBtn = detailsContainer.querySelector('.add-to-cart-detail');
        addToCartBtn.addEventListener('click', () => {
            this.addProgramToCart(programId);
            modal.style.display = 'none';
        });
        
        modal.style.display = 'block';
    }
    
    addProgramToCart(programId) {
        const program = this.programs.find(p => p.id == programId);
        if (!program) return;
        
        // Add to cart using the cart manager
        if (window.cart) {
            window.cart.addItem({
                id: `program-${program.id}`,
                name: program.name,
                price: program.price,
                image: program.image,
                type: 'program'
            });
            showNotification('برنامه به سبد خرید اضافه شد', 'success');
        }
    }
    
    getTypeLabel(type) {
        const types = {
            'fat-loss': 'چربی سوزی',
            'muscle-gain': 'عضله سازی',
            'strength': 'افزایش قدرت'
        };
        return types[type] || type;
    }
    
    getLevelLabel(level) {
        const levels = {
            'beginner': 'مبتدی',
            'intermediate': 'متوسط',
            'advanced': 'پیشرفته'
        };
        return levels[level] || level;
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(price);
    }
}

// Initialize programs manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.programsManager = new ProgramsManager();
});