// Blog page functionality
class BlogManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.currentCategory = 'all';
        this.searchTerm = '';
        
        this.init();
    }
    
    async init() {
        await this.loadPosts();
        this.renderPosts();
        this.renderSidebar();
        this.initEventListeners();
    }
    
    async loadPosts() {
        try {
            const response = await fetch('data/blog-posts.json');
            const data = await response.json();
            this.posts = data.posts;
            this.filteredPosts = [...this.posts];
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.posts = this.getFallbackPosts();
            this.filteredPosts = [...this.posts];
        }
    }
    
    getFallbackPosts() {
        return [
            {
                id: 1,
                title: "راهنمای کامل مصرف پروتئین برای ورزشکاران",
                excerpt: "پروتئین یکی از مهمترین درشت مغذی‌ها برای ورزشکاران است. در این مقاله به بررسی زمان‌بندی مصرف، انواع پروتئین‌ها و مقدار مورد نیاز برای اهداف مختلف می‌پردازیم.",
                content: "محتوی کامل مقاله...",
                image: "images/blog/post1.jpg",
                category: "تغذیه ورزشی",
                author: "دکتر محمد حسینی",
                date: "1402/08/15",
                readTime: "8 دقیقه",
                views: 1247,
                likes: 89,
                tags: ["پروتئین", "تغذیه", "عضله سازی"],
                featured: true
            },
            {
                id: 2,
                title: "تمرینات اینتروال برای چربی سوزی سریع",
                excerpt: "تمرینات اینتروال با شدت بالا (HIIT) یکی از موثرترین روش‌ها برای چربی سوزی و بهبود آمادگی قلبی-عروقی است.",
                content: "محتوی کامل مقاله...",
                image: "images/blog/post2.jpg",
                category: "تمرینات",
                author: "مربی امیر رضایی",
                date: "1402/08/10",
                readTime: "6 دقیقه",
                views: 892,
                likes: 67,
                tags: ["HIIT", "چربی سوزی", "کاردیو"],
                featured: false
            },
            {
                id: 3,
                title: "مکمل‌های ضروری برای بدنسازان مبتدی",
                excerpt: "آشنایی با مکمل‌های پایه و ضروری برای افرادی که تازه وارد دنیای بدنسازی شده‌اند.",
                content: "محتوی کامل مقاله...",
                image: "images/blog/post3.jpg",
                category: "مکمل‌ها",
                author: "کارشناس تغذیه",
                date: "1402/08/05",
                readTime: "5 دقیقه",
                views: 1567,
                likes: 112,
                tags: ["مکمل", "بدنسازی", "مبتدی"],
                featured: false
            },
            {
                id: 4,
                title: "برنامه گرم کردن اصولی قبل از تمرین",
                excerpt: "گرم کردن صحیح نه تنها از آسیب دیدگی جلوگیری می‌کند، بلکه عملکرد شما را در طول تمرین بهبود می‌بخشد.",
                content: "محتوی کامل مقاله...",
                image: "images/blog/post4.jpg",
                category: "تمرینات",
                author: "مربی سارا محمدی",
                date: "1402/08/01",
                readTime: "4 دقیقه",
                views: 734,
                likes: 45,
                tags: ["گرم کردن", "آمادگی", "تمرین"],
                featured: false
            },
            {
                id: 5,
                title: "راهکارهای افزایش انگیزه برای تمرین منظم",
                excerpt: "چگونه انگیزه خود را برای تمرین منظم حفظ کنیم و از ورزش لذت ببریم.",
                content: "محتوی کامل مقاله...",
                image: "images/blog/post5.jpg",
                category: "روانشناسی ورزشی",
                author: "دکتر نازنین کریمی",
                date: "1402/07/28",
                readTime: "7 دقیقه",
                views: 623,
                likes: 78,
                tags: ["انگیزه", "روانشناسی", "تمرین منظم"],
                featured: false
            },
            {
                id: 6,
                title: "برنامه غذایی برای افزایش حجم عضلانی",
                excerpt: "یک برنامه غذایی اصولی برای افرادی که هدفشان افزایش حجم عضلانی است.",
                content: "محتوی کامل مقاله...",
                image: "images/blog/post6.jpg",
                category: "تغذیه ورزشی",
                author: "کارشناس تغذیه",
                date: "1402/07/25",
                readTime: "9 دقیقه",
                views: 1345,
                likes: 94,
                tags: ["برنامه غذایی", "عضله سازی", "تغذیه"],
                featured: false
            }
        ];
    }
    
    renderPosts() {
        const container = document.getElementById('blog-posts');
        if (!container) return;
        
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(startIndex, endIndex);
        
        if (postsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-posts">
                    <i class="fas fa-search"></i>
                    <h3>مقاله‌ای یافت نشد</h3>
                    <p>هیچ مقاله‌ای با فیلترهای انتخاب شده مطابقت ندارد</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');
    }
    
    createPostCard(post) {
        return `
            <article class="blog-post-card" data-post-id="${post.id}">
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <div class="post-category">${post.category}</div>
                </div>
                
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-author"><i class="far fa-user"></i> ${post.author}</span>
                        <span class="post-date"><i class="far fa-clock"></i> ${post.date}</span>
                        <span class="post-read-time">${post.readTime}</span>
                    </div>
                    
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    
                    <div class="post-footer">
                        <div class="post-stats">
                            <span class="post-views"><i class="far fa-eye"></i> ${this.formatNumber(post.views)}</span>
                            <span class="post-likes"><i class="far fa-heart"></i> ${post.likes}</span>
                        </div>
                        <a href="blog-single.html?id=${post.id}" class="read-more">
                            مطالعه مقاله <i class="fas fa-arrow-left"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }
    
    renderSidebar() {
        this.renderCategories();
        this.renderPopularPosts();
    }
    
    renderCategories() {
        const categoriesContainer = document.getElementById('blog-categories');
        if (!categoriesContainer) return;
        
        const categories = [...new Set(this.posts.map(post => post.category))];
        
        categoriesContainer.innerHTML = `
            <li class="category-item ${this.currentCategory === 'all' ? 'active' : ''}">
                <a href="#" data-category="all">همه مقالات</a>
                <span class="category-count">${this.posts.length}</span>
            </li>
            ${categories.map(category => {
                const count = this.posts.filter(post => post.category === category).length;
                return `
                    <li class="category-item ${this.currentCategory === category ? 'active' : ''}">
                        <a href="#" data-category="${category}">${category}</a>
                        <span class="category-count">${count}</span>
                    </li>
                `;
            }).join('')}
        `;
    }
    
    renderPopularPosts() {
        const popularContainer = document.getElementById('popular-posts');
        if (!popularContainer) return;
        
        const popularPosts = [...this.posts]
            .sort((a, b) => b.views - a.views)
            .slice(0, 3);
        
        popularContainer.innerHTML = popularPosts.map(post => `
            <div class="popular-post-item">
                <div class="popular-post-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="popular-post-content">
                    <h4><a href="blog-single.html?id=${post.id}">${post.title}</a></h4>
                    <div class="popular-post-meta">
                        <span>${post.date}</span>
                        <span>${post.views} بازدید</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    initEventListeners() {
        // Category filter
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-item a')) {
                e.preventDefault();
                const category = e.target.closest('.category-item a').getAttribute('data-category');
                this.filterByCategory(category);
            }
        });
        
        // Search functionality
        const searchInput = document.getElementById('blog-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchPosts(e.target.value);
            });
        }
        
        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMorePosts();
            });
        }
        
        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.subscribeNewsletter(newsletterForm);
            });
        }
    }
    
    filterByCategory(category) {
        this.currentCategory = category;
        
        // Update active category in sidebar
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).closest('.category-item').classList.add('active');
        
        // Apply filter
        if (category === 'all') {
            this.filteredPosts = [...this.posts];
        } else {
            this.filteredPosts = this.posts.filter(post => post.category === category);
        }
        
        // Reset to first page
        this.currentPage = 1;
        this.renderPosts();
        this.updateLoadMoreButton();
    }
    
    searchPosts(term) {
        this.searchTerm = term.toLowerCase();
        
        if (!this.searchTerm) {
            this.filteredPosts = [...this.posts];
        } else {
            this.filteredPosts = this.posts.filter(post => 
                post.title.toLowerCase().includes(this.searchTerm) ||
                post.excerpt.toLowerCase().includes(this.searchTerm) ||
                post.content.toLowerCase().includes(this.searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(this.searchTerm))
            );
        }
        
        // Reset to first page
        this.currentPage = 1;
        this.renderPosts();
        this.updateLoadMoreButton();
    }
    
    loadMorePosts() {
        this.currentPage++;
        this.renderPosts();
        this.updateLoadMoreButton();
    }
    
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;
        
        const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        
        if (this.currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    subscribeNewsletter(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('با موفقیت در خبرنامه عضو شدید!', 'success');
            form.reset();
        }, 1000);
    }
    
    formatNumber(num) {
        return new Intl.NumberFormat('fa-IR').format(num);
    }
}

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.blogManager = new BlogManager();
});