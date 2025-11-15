// Dashboard functionality
class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'overview';
        this.userStats = {
            workoutsCompleted: 0,
            currentStreak: 0,
            goalsAchieved: 0
        };
        
        this.init();
    }
    
    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.initTabNavigation();
        this.initEventListeners();
        this.renderDashboard();
    }
    
    checkAuthentication() {
        const user = localStorage.getItem('user');
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        this.currentUser = JSON.parse(user);
        this.updateUserInfo();
    }
    
    updateUserInfo() {
        // Update welcome message
        const welcomeName = document.getElementById('welcome-name');
        if (welcomeName) {
            welcomeName.textContent = this.currentUser.name || 'کاربر';
        }
        
        // Update user menu
        const userName = document.getElementById('user-name');
        const userAvatar = document.getElementById('user-avatar');
        
        if (userName) {
            userName.textContent = this.currentUser.name || this.currentUser.email;
        }
        
        if (userAvatar && this.currentUser.avatar) {
            userAvatar.src = this.currentUser.avatar;
        }
    }
    
    loadUserData() {
        // Load user stats from localStorage or set defaults
        const savedStats = localStorage.getItem('userStats');
        if (savedStats) {
            this.userStats = JSON.parse(savedStats);
        } else {
            // Set default stats
            this.userStats = {
                workoutsCompleted: 12,
                currentStreak: 5,
                goalsAchieved: 3
            };
            this.saveUserStats();
        }
        
        this.updateStatsDisplay();
    }
    
    updateStatsDisplay() {
        document.getElementById('workouts-completed').textContent = this.userStats.workoutsCompleted;
        document.getElementById('current-streak').textContent = this.userStats.currentStreak;
        document.getElementById('goals-achieved').textContent = this.userStats.goalsAchieved;
    }
    
    saveUserStats() {
        localStorage.setItem('userStats', JSON.stringify(this.userStats));
    }
    
    initTabNavigation() {
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(navItem => navItem.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Show corresponding tab
                const tabId = item.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
    
    switchTab(tabId) {
        this.currentTab = tabId;
        
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Load tab-specific content
        this.loadTabContent(tabId);
    }
    
    loadTabContent(tabId) {
        switch (tabId) {
            case 'overview':
                this.loadOverviewContent();
                break;
            case 'programs':
                this.loadProgramsContent();
                break;
            case 'workouts':
                this.loadWorkoutsContent();
                break;
            case 'nutrition':
                this.loadNutritionContent();
                break;
            case 'progress':
                this.loadProgressContent();
                break;
            case 'orders':
                this.loadOrdersContent();
                break;
            case 'profile':
                this.loadProfileContent();
                break;
        }
    }
    
    loadOverviewContent() {
        this.renderProgressChart();
    }
    
    loadProgramsContent() {
        const container = document.getElementById('user-programs');
        if (!container) return;
        
        const userPrograms = this.getUserPrograms();
        
        if (userPrograms.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-dumbbell"></i>
                    <h3>هنوز برنامه‌ای ندارید</h3>
                    <p>برای شروع، یک برنامه تمرینی انتخاب کنید</p>
                    <a href="programs.html" class="btn btn-primary">مشاهده برنامه‌ها</a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = userPrograms.map(program => `
            <div class="program-card" data-program-id="${program.id}">
                <div class="program-header">
                    <h3>${program.name}</h3>
                    <span class="program-status ${program.status}">${this.getProgramStatusLabel(program.status)}</span>
                </div>
                
                <div class="program-progress">
                    <div class="progress-info">
                        <span class="progress-label">پیشرفت</span>
                        <span class="progress-percentage">${program.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${program.progress}%"></div>
                    </div>
                </div>
                
                <div class="program-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>شروع: ${program.startDate}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-flag"></i>
                        <span>پایان: ${program.endDate}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-dumbbell"></i>
                        <span>${program.workoutsCompleted} از ${program.totalWorkouts} جلسه</span>
                    </div>
                </div>
                
                <div class="program-actions">
                    <button class="btn btn-outline" onclick="dashboard.viewProgramDetails(${program.id})">
                        مشاهده جزئیات
                    </button>
                    <button class="btn btn-primary" onclick="dashboard.continueProgram(${program.id})">
                        ادامه برنامه
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    getUserPrograms() {
        // In a real app, this would come from an API
        return [
            {
                id: 1,
                name: "برنامه چربی سوزی حرفه‌ای",
                status: "active",
                progress: 65,
                startDate: "1402/08/01",
                endDate: "1402/11/01",
                workoutsCompleted: 13,
                totalWorkouts: 20,
                type: "fat-loss"
            },
            {
                id: 2,
                name: "برنامه افزایش قدرت",
                status: "paused",
                progress: 30,
                startDate: "1402/07/15",
                endDate: "1402/10/15",
                workoutsCompleted: 6,
                totalWorkouts: 20,
                type: "strength"
            }
        ];
    }
    
    getProgramStatusLabel(status) {
        const labels = {
            'active': 'در حال اجرا',
            'paused': 'متوقف شده',
            'completed': 'تکمیل شده',
            'not-started': 'شروع نشده'
        };
        return labels[status] || status;
    }
    
    renderProgressChart() {
        const chartContainer = document.getElementById('progress-chart');
        if (!chartContainer) return;
        
        // Simple progress chart using CSS
        chartContainer.innerHTML = `
            <div class="chart-bars">
                <div class="chart-bar">
                    <div class="bar-label">شنبه</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 80%"></div>
                    </div>
                    <div class="bar-value">۸۰%</div>
                </div>
                <div class="chart-bar">
                    <div class="bar-label">یکشنبه</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 65%"></div>
                    </div>
                    <div class="bar-value">۶۵%</div>
                </div>
                <div class="chart-bar">
                    <div class="bar-label">دوشنبه</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 90%"></div>
                    </div>
                    <div class="bar-value">۹۰%</div>
                </div>
                <div class="chart-bar">
                    <div class="bar-label">سه‌شنبه</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 45%"></div>
                    </div>
                    <div class="bar-value">۴۵%</div>
                </div>
                <div class="chart-bar">
                    <div class="bar-label">چهارشنبه</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 75%"></div>
                    </div>
                    <div class="bar-value">۷۵%</div>
                </div>
                <div class="chart-bar">
                    <div class="bar-label">پنجشنبه</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 60%"></div>
                    </div>
                    <div class="bar-value">۶۰%</div>
                </div>
                <div class="chart-bar">
                    <div class="bar-label">جمعه</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 0%"></div>
                    </div>
                    <div class="bar-value">۰%</div>
                </div>
            </div>
        `;
    }
    
    initEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (window.authManager) {
                    window.authManager.logout();
                }
            });
        }
        
        // Start workout button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn') && e.target.closest('.btn').textContent.includes('شروع تمرین')) {
                this.startWorkout();
            }
        });
    }
    
    startWorkout() {
        showNotification('تمرین امروز شروع شد! 💪', 'success');
        
        // Update stats
        this.userStats.workoutsCompleted++;
        this.userStats.currentStreak++;
        this.saveUserStats();
        this.updateStatsDisplay();
        
        // Simulate workout completion after 3 seconds
        setTimeout(() => {
            showNotification('تمرین با موفقیت انجام شد! 🎉', 'success');
        }, 3000);
    }
    
    viewProgramDetails(programId) {
        // Navigate to program details page
        window.location.href = `program-details.html?id=${programId}`;
    }
    
    continueProgram(programId) {
        showNotification('ادامه برنامه با موفقیت شروع شد', 'success');
        // In a real app, this would navigate to the workout interface
    }
    
    renderDashboard() {
        this.loadTabContent(this.currentTab);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new DashboardManager();
});