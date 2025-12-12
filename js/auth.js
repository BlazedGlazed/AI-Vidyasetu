// Authentication JavaScript for NeighbourShare Login Page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoader();
    initDarkMode();
    initPasswordToggle();
    initFloatingLabels();
    initFormValidation();
    initSocialLogin();
    initBackHomeButton();
});

// =========================================
// 1. Loading Animation
// =========================================
function initLoader() {
    const loader = document.querySelector('.loader');
    
    // Hide loader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }, 500);
    });
}

// =========================================
// 2. Dark Mode Toggle
// =========================================
function initDarkMode() {
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;
    
    // Check for saved theme or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Set initial theme
    if (savedTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    }
    
    // Create theme toggle if it doesn't exist in the DOM
    if (!themeToggle) {
        // Add theme toggle to page
        const backHome = document.querySelector('.back-home');
        if (backHome) {
            const toggle = document.createElement('div');
            toggle.className = 'theme-toggle';
            toggle.innerHTML = `
                <i class="fas fa-sun"></i>
                <i class="fas fa-moon"></i>
            `;
            backHome.parentNode.insertBefore(toggle, backHome.nextSibling);
            
            // Add event listener to new toggle
            toggle.addEventListener('click', toggleTheme);
        }
    } else {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
    
    function toggleTheme() {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
    }
}

// =========================================
// 3. Password Visibility Toggle
// =========================================
function initPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Hide password');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Show password');
            }
        });
    }
}

// =========================================
// 4. Floating Labels Animation
// =========================================
function initFloatingLabels() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        // Check if input has value on page load
        if (input.value) {
            input.nextElementSibling.classList.add('active');
        }
        
        // Add focus/blur events
        input.addEventListener('focus', function() {
            this.nextElementSibling.classList.add('active', 'focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.nextElementSibling.classList.remove('active');
            }
            this.nextElementSibling.classList.remove('focused');
        });
        
        // Add input event for dynamic validation
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
}

// =========================================
// 5. Form Validation
// =========================================
function initFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.btn-login');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Validate form
            if (validateForm(email, password)) {
                // Show loading state
                loginBtn.classList.add('loading');
                loginBtn.disabled = true;
                
                // Simulate API call (replace with actual backend integration)
                simulateLogin(email, password, rememberMe);
            }
        });
    }
}

function validateForm(email, password) {
    let isValid = true;
    
    // Reset all errors
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
        const hint = input.parentElement.nextElementSibling;
        if (hint && hint.classList.contains('input-hint')) {
            hint.classList.remove('error');
        }
    });
    
    // Validate email
    const emailInput = document.getElementById('email');
    const emailHint = emailInput.parentElement.nextElementSibling;
    
    if (!email) {
        showError(emailInput, emailHint, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError(emailInput, emailHint, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    const passwordInput = document.getElementById('password');
    const passwordHint = passwordInput.parentElement.nextElementSibling;
    
    if (!password) {
        showError(passwordInput, passwordHint, 'Password is required');
        isValid = false;
    } else if (password.length < 8) {
        showError(passwordInput, passwordHint, 'Password must be at least 8 characters');
        isValid = false;
    }
    
    return isValid;
}

function validateField(input) {
    const value = input.value.trim();
    const hint = input.parentElement.nextElementSibling;
    
    // Remove any existing error
    input.classList.remove('error');
    if (hint) hint.classList.remove('error');
    
    // Validate based on input type
    if (input.type === 'email' && value) {
        if (!isValidEmail(value)) {
            showError(input, hint, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (input.type === 'password' && value) {
        if (value.length < 8) {
            showError(input, hint, 'Password must be at least 8 characters');
            return false;
        }
    }
    
    return true;
}

function showError(input, hint, message) {
    input.classList.add('error');
    if (hint) {
        hint.classList.add('error');
        hint.textContent = message;
        hint.style.color = '#ff4757';
    }
    
    // Add shake animation
    input.style.animation = 'shake 0.5s';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// =========================================
// 6. Simulate Login (Backend Integration)
// =========================================
function simulateLogin(email, password, rememberMe) {
    // This is a mock simulation - replace with actual API call
    
    // Simulate network delay
    setTimeout(() => {
        const loginBtn = document.querySelector('.btn-login');
        const isSuccess = Math.random() > 0.3; // 70% success rate for demo
        
        if (isSuccess) {
            // Show success alert
            showAlert('successAlert', 'Login successful! Redirecting to dashboard...');
            
            // Store session (in a real app, this would be a token)
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            // Simulate redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html'; // Replace with actual dashboard URL
            }, 2000);
        } else {
            // Show error alert
            const errorMsg = getRandomErrorMessage();
            showAlert('errorAlert', errorMsg);
            
            // Reset button
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }, 1500);
}

function getRandomErrorMessage() {
    const errors = [
        'Invalid email or password. Please try again.',
        'Account not found. Please check your email.',
        'Incorrect password. Please try again.',
        'Too many login attempts. Please try again in 15 minutes.',
        'Account is temporarily locked. Please reset your password.'
    ];
    return errors[Math.floor(Math.random() * errors.length)];
}

// =========================================
// 7. Alert System
// =========================================
function showAlert(alertId, message) {
    const alert = document.getElementById(alertId);
    const messageElement = alert.querySelector('p');
    
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    alert.classList.add('show');
    
    // Auto-hide success alert after 5 seconds
    if (alertId === 'successAlert') {
        setTimeout(() => {
            hideAlert(alertId);
        }, 5000);
    }
}

function hideAlert(alertId) {
    const alert = document.getElementById(alertId);
    if (alert) {
        alert.classList.remove('show');
    }
}

// =========================================
// 8. Social Login
// =========================================
function initSocialLogin() {
    const googleBtn = document.querySelector('.google-btn');
    const appleBtn = document.querySelector('.apple-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            // Simulate Google OAuth
            showAlert('successAlert', 'Redirecting to Google authentication...');
            
            // In a real app, this would redirect to OAuth endpoint
            setTimeout(() => {
                showAlert('errorAlert', 'Google authentication is not configured in this demo.');
            }, 1000);
        });
    }
    
    if (appleBtn) {
        appleBtn.addEventListener('click', function() {
            // Simulate Apple OAuth
            showAlert('successAlert', 'Redirecting to Apple authentication...');
            
            // In a real app, this would redirect to OAuth endpoint
            setTimeout(() => {
                showAlert('errorAlert', 'Apple authentication is not configured in this demo.');
            }, 1000);
        });
    }
}

// =========================================
// 9. Back Home Button
// =========================================
function initBackHomeButton() {
    const backHomeBtn = document.querySelector('.back-home');
    
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add smooth transition
            document.body.style.opacity = '0.8';
            
            // Navigate after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 300);
        });
    }
}

// =========================================
// 10. Input Animation
// =========================================
// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .form-input.error {
        border-color: #ff4757 !important;
        animation: shake 0.5s;
    }
    
    .input-hint.error {
        color: #ff4757 !important;
    }
    
    .floating-label.active {
        top: -10px !important;
        left: 10px !important;
        font-size: 12px !important;
        background: var(--glass) !important;
        padding: 0 8px !important;
        color: var(--primary) !important;
        border-radius: 10px !important;
    }
    
    .floating-label.focused {
        color: var(--primary) !important;
    }
`;
document.head.appendChild(style);