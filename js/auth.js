// Authentication functionality
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.checkAuthStatus();
        this.initAuthForms();
        this.initPasswordToggle();
        this.initPasswordStrength();
    }
    
    checkAuthStatus() {
        const user = localStorage.getItem('user');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.updateAuthUI();
        }
    }
    
    updateAuthUI() {
        const authLinks = document.querySelector('.auth-links');
        const userMenu = document.querySelector('.user-menu');
        
        if (this.currentUser && authLinks && userMenu) {
            authLinks.style.display = 'none';
            userMenu.style.display = 'flex';
            
            // Update user info in menu
            const userName = userMenu.querySelector('.user-name');
            if (userName) {
                userName.textContent = this.currentUser.name || this.currentUser.email;
            }
        }
    }
    
    initAuthForms() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
        
        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }
        
        // Social auth buttons
        this.initSocialAuth();
    }
    
    handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        this.setButtonLoading(submitBtn, true);
        
        // Validate form
        if (!this.validateLoginForm(form)) {
            this.setButtonLoading(submitBtn, false);
            return;
        }
        
        // Simulate API call
        setTimeout(() => {
            const email = formData.get('email');
            const password = formData.get('password');
            
            if (this.authenticateUser(email, password)) {
                showNotification('ورود موفقیت‌آمیز بود!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showNotification('ایمیل یا رمز عبور نادرست است', 'error');
                this.setButtonLoading(submitBtn, false);
            }
        }, 2000);
    }
    
    handleRegister(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        this.setButtonLoading(submitBtn, true);
        
        // Validate form
        if (!this.validateRegisterForm(form)) {
            this.setButtonLoading(submitBtn, false);
            return;
        }
        
        // Simulate API call
        setTimeout(() => {
            const userData = {
                id: this.generateUserId(),
                name: `${formData.get('first_name')} ${formData.get('last_name')}`,
                email: formData.get('email'),
                phone: formData.get('phone'),
                goal: formData.get('goal'),
                joinDate: new Date().toLocaleDateString('fa-IR'),
                membership: 'basic',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.get('first_name') + ' ' + formData.get('last_name'))}&background=E63946&color=fff`
            };
            
            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            showNotification('حساب کاربری با موفقیت ایجاد شد!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }, 2000);
    }
    
    validateLoginForm(form) {
        const email = form.querySelector('#email');
        const password = form.querySelector('#password');
        let isValid = true;
        
        // Reset errors
        this.clearFormErrors(form);
        
        // Email validation
        if (!email.value.trim()) {
            this.showFieldError(email, 'ایمیل الزامی است');
            isValid = false;
        } else if (!this.isValidEmail(email.value)) {
            this.showFieldError(email, 'ایمیل معتبر نیست');
            isValid = false;
        }
        
        // Password validation
        if (!password.value) {
            this.showFieldError(password, 'رمز عبور الزامی است');
            isValid = false;
        } else if (password.value.length < 6) {
            this.showFieldError(password, 'رمز عبور باید حداقل ۶ کاراکتر باشد');
            isValid = false;
        }
        
        return isValid;
    }
    
    validateRegisterForm(form) {
        const fields = {
            first_name: form.querySelector('#first_name'),
            last_name: form.querySelector('#last_name'),
            email: form.querySelector('#email'),
            phone: form.querySelector('#phone'),
            password: form.querySelector('#password'),
            confirm_password: form.querySelector('#confirm_password'),
            goal: form.querySelector('#goal')
        };
        
        let isValid = true;
        
        // Reset errors
        this.clearFormErrors(form);
        
        // Name validation
        if (!fields.first_name.value.trim()) {
            this.showFieldError(fields.first_name, 'نام الزامی است');
            isValid = false;
        }
        
        if (!fields.last_name.value.trim()) {
            this.showFieldError(fields.last_name, 'نام خانوادگی الزامی است');
            isValid = false;
        }
        
        // Email validation
        if (!fields.email.value.trim()) {
            this.showFieldError(fields.email, 'ایمیل الزامی است');
            isValid = false;
        } else if (!this.isValidEmail(fields.email.value)) {
            this.showFieldError(fields.email, 'ایمیل معتبر نیست');
            isValid = false;
        } else if (this.isEmailRegistered(fields.email.value)) {
            this.showFieldError(fields.email, 'این ایمیل قبلاً ثبت شده است');
            isValid = false;
        }
        
        // Phone validation
        if (!fields.phone.value.trim()) {
            this.showFieldError(fields.phone, 'شماره تماس الزامی است');
            isValid = false;
        } else if (!this.isValidPhone(fields.phone.value)) {
            this.showFieldError(fields.phone, 'شماره تماس معتبر نیست');
            isValid = false;
        }
        
        // Password validation
        if (!fields.password.value) {
            this.showFieldError(fields.password, 'رمز عبور الزامی است');
            isValid = false;
        } else if (fields.password.value.length < 8) {
            this.showFieldError(fields.password, 'رمز عبور باید حداقل ۸ کاراکتر باشد');
            isValid = false;
        }
        
        // Confirm password
        if (fields.password.value !== fields.confirm_password.value) {
            this.showFieldError(fields.confirm_password, 'رمز عبور و تکرار آن مطابقت ندارند');
            isValid = false;
        }
        
        // Goal validation
        if (!fields.goal.value) {
            this.showFieldError(fields.goal, 'لطفا هدف خود را انتخاب کنید');
            isValid = false;
        }
        
        // Terms acceptance
        const termsCheckbox = form.querySelector('input[name="terms"]');
        if (!termsCheckbox.checked) {
            showNotification('لطفاً قوانین و مقررات را بپذیرید', 'error');
            isValid = false;
        }
        
        return isValid;
    }
    
    initPasswordToggle() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.closest('.input-with-icon').querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
    
    initPasswordStrength() {
        const passwordInput = document.getElementById('password');
        if (!passwordInput) return;
        
        passwordInput.addEventListener('input', () => {
            this.updatePasswordStrength(passwordInput.value);
        });
    }
    
    updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        let text = 'ضعیف';
        let color = '#E63946';
        
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        
        if (strength >= 75) {
            text = 'قوی';
            color = '#28a745';
        } else if (strength >= 50) {
            text = 'متوسط';
            color = '#ffc107';
        } else if (strength >= 25) {
            text = 'ضعیف';
            color = '#E63946';
        } else {
            text = 'خیلی ضعیف';
            color = '#dc3545';
        }
        
        strengthBar.style.width = `${strength}%`;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
    
    initSocialAuth() {
        document.querySelectorAll('.btn-google').forEach(btn => {
            btn.addEventListener('click', () => {
                showNotification('ورود با گوگل در حال توسعه است', 'info');
            });
        });
    }
    
    authenticateUser(email, password) {
        // In a real app, this would be an API call
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Don't store password in user session
            const { password, ...userWithoutPassword } = user;
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            this.currentUser = userWithoutPassword;
            return true;
        }
        
        return false;
    }
    
    isEmailRegistered(email) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => user.email === email);
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^09[0-9]{9}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFormErrors(form) {
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        form.querySelectorAll('.field-error').forEach(error => {
            error.remove();
        });
    }
    
    setButtonLoading(button, loading) {
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        if (loading) {
            button.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'block';
        } else {
            button.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        }
    }
    
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    
    logout() {
        localStorage.removeItem('user');
        this.currentUser = null;
        showNotification('خروج موفقیت‌آمیز بود', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
});