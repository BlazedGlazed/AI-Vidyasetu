// Signup JavaScript for NeighbourShare

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoader();
    initDarkMode();
    initPasswordToggle();
    initFormValidation();
    initStepNavigation();
    initPasswordStrength();
    initOTPInput();
    initImageUpload();
    initProgressBar();
    initBackHomeButton();
    initShakeAnimation();
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
    const root = document.documentElement;
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Set initial theme
    if (savedTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

// =========================================
// 3. Password Toggle
// =========================================
function initPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
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
// 4. Form Validation
// =========================================
function initFormValidation() {
    const step1Form = document.getElementById('step1Form');
    const step2Form = document.getElementById('step2Form');
    const step3Form = document.getElementById('step3Form');
    
    if (step1Form) {
        step1Form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep1()) {
                goToStep(2);
            }
        });
        
        // Real-time validation
        const inputs = step1Form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
                if (this.id === 'password') {
                    updatePasswordStrength(this.value);
                }
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
    
    if (step2Form) {
        step2Form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep2()) {
                goToStep(3);
            }
        });
        
        // Real-time validation for step 2
        const step2Inputs = step2Form.querySelectorAll('.form-input');
        step2Inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
    
    if (step3Form) {
        step3Form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep3()) {
                completeRegistration();
            }
        });
    }
}

function validateStep1() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const terms = document.getElementById('terms').checked;
    
    let isValid = true;
    
    // Validate full name
    if (!fullName || fullName.length < 2) {
        showError('fullName', 'Please enter your full name');
        isValid = false;
    } else {
        clearError('fullName');
    }
    
    // Validate email
    if (!email || !isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError('email');
    }
    
    // Validate password
    if (!password || password.length < 8) {
        showError('password', 'Password must be at least 8 characters');
        isValid = false;
    } else if (!isStrongPassword(password)) {
        showError('password', 'Password must include uppercase, lowercase, number, and special character');
        isValid = false;
    } else {
        clearError('password');
    }
    
    // Validate terms
    if (!terms) {
        const termsInput = document.getElementById('terms');
        termsInput.parentElement.classList.add('error');
        isValid = false;
    } else {
        document.getElementById('terms').parentElement.classList.remove('error');
    }
    
    return isValid;
}

function validateStep2() {
    const address1 = document.getElementById('address1').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('zipCode').value.trim();
    
    let isValid = true;
    
    // Validate address
    if (!address1 || address1.length < 5) {
        showError('address1', 'Please enter a valid street address');
        isValid = false;
    } else {
        clearError('address1');
    }
    
    // Validate city
    if (!city || city.length < 2) {
        showError('city', 'Please enter a valid city name');
        isValid = false;
    } else {
        clearError('city');
    }
    
    // Validate state
    if (!state) {
        showError('state', 'Please select your state');
        isValid = false;
    } else {
        clearError('state');
    }
    
    // Validate ZIP code
    if (!zipCode || !/^\d{5}$/.test(zipCode)) {
        showError('zipCode', 'Please enter a valid 5-digit ZIP code');
        isValid = false;
    } else {
        clearError('zipCode');
    }
    
    return isValid;
}

function validateStep3() {
    const otpInputs = document.querySelectorAll('.otp-input');
    let otp = '';
    
    otpInputs.forEach(input => {
        otp += input.value;
    });
    
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        otpInputs.forEach(input => {
            input.classList.add('error');
        });
        
        // Shake animation
        const otpContainer = document.querySelector('.otp-container');
        otpContainer.style.animation = 'shake 0.5s';
        setTimeout(() => {
            otpContainer.style.animation = '';
        }, 500);
        
        return false;
    }
    
    // Mock OTP verification
    if (otp !== '123456') {
        otpInputs.forEach(input => {
            input.classList.add('error');
        });
        return false;
    }
    
    return true;
}

function validateField(input) {
    const value = input.value.trim();
    const id = input.id;
    
    // Clear previous error
    clearError(id);
    
    // Validate based on field type
    if (input.hasAttribute('required') && !value) {
        showError(id, 'This field is required');
        return false;
    }
    
    switch (input.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showError(id, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'password':
            if (value && value.length < 8) {
                showError(id, 'Password must be at least 8 characters');
                return false;
            }
            break;
            
        case 'tel':
            if (value && !/^[\d\s\-\+\(\)]{10,}$/.test(value)) {
                showError(id, 'Please enter a valid phone number');
                return false;
            }
            break;
    }
    
    // If all validations pass
    if (value) {
        input.classList.add('valid');
    }
    
    return true;
}

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const validation = input.parentElement.querySelector('.input-validation');
    
    if (input) {
        input.classList.remove('valid');
        input.classList.add('error');
        
        // Add shake animation
        input.style.animation = 'shake 0.5s';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }
    
    if (validation) {
        validation.querySelector('.error-icon').style.display = 'block';
        validation.querySelector('.valid-icon').style.display = 'none';
    }
}

function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const validation = input?.parentElement.querySelector('.input-validation');
    
    if (input) {
        input.classList.remove('error');
    }
    
    if (validation) {
        validation.querySelector('.error-icon').style.display = 'none';
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isStrongPassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
}

// =========================================
// 5. Password Strength Meter
// =========================================
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
}

function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text span');
    const requirements = document.querySelectorAll('.password-requirements li');
    
    let strength = 0;
    const totalChecks = 5;
    
    // Check requirements
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Update requirement indicators
    requirements.forEach(req => {
        const requirement = req.getAttribute('data-requirement');
        if (checks[requirement]) {
            req.classList.add('valid');
            strength++;
        } else {
            req.classList.remove('valid');
        }
    });
    
    // Update strength bar
    const percentage = (strength / totalChecks) * 100;
    strengthBar.style.width = percentage + '%';
    
    // Update strength text and color
    let strengthLevel = 'Very weak';
    let color = '#ff4757'; // Red
    
    if (strength >= 3) {
        strengthLevel = 'Fair';
        color = '#f39c12'; // Orange
    }
    if (strength >= 4) {
        strengthLevel = 'Good';
        color = '#2ecc71'; // Green
    }
    if (strength === 5) {
        strengthLevel = 'Strong';
        color = '#27ae60'; // Dark green
    }
    
    strengthBar.style.background = color;
    strengthText.textContent = strengthLevel;
    strengthText.style.color = color;
}

// =========================================
// 6. Step Navigation
// =========================================
function initStepNavigation() {
    window.currentStep = 1;
    window.totalSteps = 3;
}

function goToStep(stepNumber) {
    // Validate current step before proceeding
    if (stepNumber > window.currentStep) {
        if (window.currentStep === 1 && !validateStep1()) return;
        if (window.currentStep === 2 && !validateStep2()) return;
    }
    
    // Hide current step
    const currentStepEl = document.getElementById(`step${window.currentStep}`);
    currentStepEl.classList.remove('active');
    
    // Show new step
    window.currentStep = stepNumber;
    const newStepEl = document.getElementById(`step${window.currentStep}`);
    newStepEl.classList.add('active');
    
    // Update progress bar
    updateProgressBar();
    
    // Update email display in step 3
    if (stepNumber === 3) {
        const email = document.getElementById('email').value;
        document.getElementById('displayEmail').textContent = email || 'user@example.com';
        startCountdown();
    }
}

function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const steps = document.querySelectorAll('.progress-step');
    
    // Calculate progress percentage
    const percentage = ((window.currentStep - 1) / (window.totalSteps - 1)) * 100;
    progressFill.style.width = percentage + '%';
    
    // Update step indicators
    steps.forEach(step => {
        const stepNumber = parseInt(step.getAttribute('data-step'));
        if (stepNumber <= window.currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// =========================================
// 7. OTP Input
// =========================================
function initOTPInput() {
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            // Auto-focus next input
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            // Update visual state
            this.classList.toggle('filled', this.value.length === 1);
            this.classList.remove('error');
        });
        
        input.addEventListener('keydown', function(e) {
            // Handle backspace
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
            
            // Only allow numbers
            if (!/^\d$/.test(e.key) && 
                !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').slice(0, 6);
            
            // Fill all inputs with pasted data
            pasteData.split('').forEach((char, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = char;
                    otpInputs[i].classList.add('filled');
                }
            });
            
            // Focus last filled input
            const lastIndex = Math.min(pasteData.length - 1, otpInputs.length - 1);
            otpInputs[lastIndex].focus();
        });
    });
}

// =========================================
// 8. Image Upload
// =========================================
function initImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('profilePicture');
    const preview = document.getElementById('uploadPreview');
    const imagePreview = document.getElementById('imagePreview');
    
    if (uploadArea && fileInput) {
        // Click on upload area
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadArea.style.borderColor = 'var(--primary)';
            uploadArea.style.background = 'rgba(126, 217, 87, 0.1)';
        }
        
        function unhighlight() {
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        }
        
        // Handle drop
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
        
        // Handle file input change
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
        
        function handleFiles(files) {
            if (files.length > 0) {
                const file = files[0];
                
                // Validate file type
                if (!file.type.match('image.*')) {
                    alert('Please select an image file (JPG, PNG, GIF)');
                    return;
                }
                
                // Validate file size (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    return;
                }
                
                // Preview image
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    preview.classList.add('show');
                    uploadArea.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        }
    }
}

function removeImage() {
    const preview = document.getElementById('uploadPreview');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('profilePicture');
    
    preview.classList.remove('show');
    uploadArea.style.display = 'block';
    fileInput.value = '';
}

// =========================================
// 9. Progress Bar
// =========================================
function initProgressBar() {
    updateProgressBar();
}

// =========================================
// 10. Countdown Timer
// =========================================
function startCountdown() {
    let timeLeft = 300; // 5 minutes in seconds
    const countdownElement = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            countdownElement.textContent = '00:00';
            countdownElement.style.color = 'var(--error)';
        } else {
            timeLeft--;
        }
    }, 1000);
}

// =========================================
// 11. Complete Registration
// =========================================
function completeRegistration() {
    const completeBtn = document.getElementById('completeBtn');
    const successScreen = document.getElementById('successScreen');
    
    // Show loading state
    completeBtn.classList.add('loading');
    completeBtn.disabled = true;
    completeBtn.querySelector('.btn-text').textContent = 'Creating Account...';
    
    // Simulate API call
    setTimeout(() => {
        // Hide form, show success screen
        document.querySelector('.signup-step.active').classList.remove('active');
        successScreen.classList.add('show');
        
        // Store user data in localStorage (for demo purposes)
        const userData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address1').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            radius: document.querySelector('input[name="radius"]:checked').value,
            verified: true,
            joined: new Date().toISOString()
        };
        
        localStorage.setItem('neighbourShareUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
    }, 2000);
}

// =========================================
// 12. Resend Code
// =========================================
function resendCode() {
    const resendBtn = document.querySelector('.btn-text');
    const originalText = resendBtn.textContent;
    
    // Disable button and show loading
    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';
    resendBtn.style.opacity = '0.7';
    
    // Simulate sending
    setTimeout(() => {
        // Re-enable button
        resendBtn.disabled = false;
        resendBtn.textContent = originalText;
        resendBtn.style.opacity = '1';
        
        // Show success message
        alert('New verification code sent to your email!');
        
        // Reset countdown
        startCountdown();
    }, 1500);
}

// =========================================
// 13. Navigation Functions
// =========================================
function goToHome() {
    if (confirm('Are you sure you want to cancel registration? Your progress will be lost.')) {
        window.location.href = 'index.html';
    }
}

function goToDashboard() {
    window.location.href = 'dashboard.html';
}

function goToBrowse() {
    window.location.href = 'browse.html';
}

// =========================================
// 14. Back Home Button
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
// 15. Shake Animation CSS
// =========================================
function initShakeAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .form-input.error {
            border-color: var(--error) !important;
        }
        
        .checkbox-container.error {
            color: var(--error);
        }
        
        .checkbox-container.error .checkmark {
            border-color: var(--error);
        }
        
        .btn.loading {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .btn.loading .btn-text {
            position: relative;
            padding-left: 25px;
        }
        
        .btn.loading .btn-text::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
            to {
                transform: translateY(-50%) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
}

// =========================================
// 16. Ripple Effect for Buttons
// =========================================
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-ripple')) {
        const button = e.target.closest('.btn-ripple');
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.classList.add('ripple');
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});