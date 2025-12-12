// Main JavaScript for NeighbourShare Homepage

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoader();
    initNavbar();
    initSearchBar();
    initCategorySlider();
    initHowItWorks();
    initImpactStats();
    initTestimonialsCarousel();
    initCTA();
    initScrollAnimations();
    initCharts();
    initRippleEffects();
});

// =========================================
// 1. Loading Animation
// =========================================
function initLoader() {
    const loader = document.querySelector('.loader');
    
    // Simulate loading time
    setTimeout(() => {
        loader.classList.add('fade-out');
        
        // Remove loader from DOM after animation completes
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }, 1500);
}

// =========================================
// 2. Navbar Effects
// =========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.navbar__mobile-toggle');
    const navbarMenu = document.querySelector('.navbar__menu');
    const navbarLinks = document.querySelectorAll('.navbar__link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', function() {
        navbarMenu.style.display = navbarMenu.style.display === 'flex' ? 'none' : 'flex';
        this.innerHTML = navbarMenu.style.display === 'flex' ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });
    
    // Active link indicator
    navbarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navbarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu if open
            if (window.innerWidth <= 992) {
                navbarMenu.style.display = 'none';
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Responsive menu behavior
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            navbarMenu.style.display = 'flex';
        } else {
            navbarMenu.style.display = 'none';
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// =========================================
// 3. Animated Search Bar
// =========================================
function initSearchBar() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    // Search input focus effect
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-5px)';
        this.parentElement.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
        this.parentElement.style.boxShadow = 'var(--shadow-lg)';
    });
    
    // Search button click
    searchBtn.addEventListener('click', function() {
        if (searchInput.value.trim() === '') {
            // Add shake animation
            searchInput.parentElement.style.animation = 'shake 0.5s';
            setTimeout(() => {
                searchInput.parentElement.style.animation = '';
            }, 500);
            searchInput.focus();
        } else {
            // Simulate search
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Searching...</span>';
            setTimeout(() => {
                searchBtn.innerHTML = '<i class="fas fa-bolt"></i><span>Find Now</span>';
                alert(`Searching for: "${searchInput.value}" - This would redirect to browse page with results.`);
            }, 1500);
        }
    });
    
    // Enter key support
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// Shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// =========================================
// 4. Category Slider
// =========================================
function initCategorySlider() {
    const sliderContainer = document.querySelector('.categories-container');
    const prevBtn = document.querySelector('.slider-btn-prev');
    const nextBtn = document.querySelector('.slider-btn-next');
    const cards = document.querySelectorAll('.category-card');
    const dots = document.querySelectorAll('.categories-indicator .indicator-dot');
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 24; // width + gap
    
    // Set initial active state
    updateActiveCard(0);
    
    // Next button
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % Math.ceil(cards.length / 2);
        scrollToCard(currentIndex);
        updateActiveCard(currentIndex * 2);
    });
    
    // Previous button
    prevBtn.addEventListener('click', function() {
        currentIndex = currentIndex === 0 ? Math.ceil(cards.length / 2) - 1 : currentIndex - 1;
        scrollToCard(currentIndex);
        updateActiveCard(currentIndex * 2);
    });
    
    // Dot indicators
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentIndex = index;
            scrollToCard(currentIndex);
            updateActiveCard(currentIndex * 2);
        });
    });
    
    // Card click
    cards.forEach(card => {
        card.addEventListener('click', function() {
            cards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Auto slide every 5 seconds
    let autoSlide = setInterval(() => {
        currentIndex = (currentIndex + 1) % Math.ceil(cards.length / 2);
        scrollToCard(currentIndex);
        updateActiveCard(currentIndex * 2);
    }, 5000);
    
    // Pause auto-slide on hover
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
    sliderContainer.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            currentIndex = (currentIndex + 1) % Math.ceil(cards.length / 2);
            scrollToCard(currentIndex);
            updateActiveCard(currentIndex * 2);
        }, 5000);
    });
    
    // Helper functions
    function scrollToCard(index) {
        const scrollAmount = index * cardWidth * 2;
        sliderContainer.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
    
    function updateActiveCard(index) {
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index || i === index + 1) {
                card.classList.add('active');
            }
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === Math.floor(index / 2)) {
                dot.classList.add('active');
            }
        });
    }
}

// =========================================
// 5. How It Works Animation
// =========================================
function initHowItWorks() {
    const stepCards = document.querySelectorAll('.step-card');
    
    // Animate step cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const step = entry.target.getAttribute('data-step');
                entry.target.style.animationDelay = `${step * 0.2}s`;
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.3 });
    
    stepCards.forEach(card => observer.observe(card));
    
    // Add animation class
    const style = document.createElement('style');
    style.textContent = `
        .step-card.animated {
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(30px);
        }
        
        @keyframes slideUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// =========================================
// 6. Impact Stats Counter
// =========================================
function initImpactStats() {
    const statNumbers = document.querySelectorAll('.impact-number span, .impact-number[data-count]');
    const heroStats = document.querySelectorAll('.stat-number[data-count]');
    
    // Animate all counters
    animateCounters(statNumbers);
    animateCounters(heroStats);
    
    function animateCounters(elements) {
        elements.forEach(element => {
            const target = parseInt(element.getAttribute('data-count') || element.textContent.replace('$', '').replace('K', ''));
            const suffix = element.textContent.includes('K') ? 'K' : '';
            const prefix = element.textContent.includes('$') ? '$' : '';
            
            // Start animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateValue(element, 0, target, 1500, prefix, suffix);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }
    
    // Counter animation function
    function animateValue(element, start, end, duration, prefix = '', suffix = '') {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            if (suffix === 'K' && value >= 1000) {
                element.textContent = `${prefix}${(value/1000).toFixed(0)}${suffix}`;
            } else {
                element.textContent = `${prefix}${value}${suffix}`;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}

// =========================================
// 7. Testimonials Carousel
// =========================================
function initTestimonialsCarousel() {
    const carouselContainer = document.querySelector('.testimonials-container');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonials-indicator .indicator-dot');
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 30; // width + gap
    
    // Set initial active state
    updateActiveTestimonial(0);
    
    // Next button
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % cards.length;
        scrollToTestimonial(currentIndex);
        updateActiveTestimonial(currentIndex);
    });
    
    // Previous button
    prevBtn.addEventListener('click', function() {
        currentIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
        scrollToTestimonial(currentIndex);
        updateActiveTestimonial(currentIndex);
    });
    
    // Dot indicators
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentIndex = index;
            scrollToTestimonial(currentIndex);
            updateActiveTestimonial(currentIndex);
        });
    });
    
    // Auto slide every 7 seconds
    let autoSlide = setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        scrollToTestimonial(currentIndex);
        updateActiveTestimonial(currentIndex);
    }, 7000);
    
    // Pause auto-slide on hover
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carouselContainer.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            scrollToTestimonial(currentIndex);
            updateActiveTestimonial(currentIndex);
        }, 7000);
    });
    
    // Helper functions
    function scrollToTestimonial(index) {
        const scrollAmount = index * cardWidth;
        carouselContainer.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
    
    function updateActiveTestimonial(index) {
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
    }
}

// =========================================
// 8. CTA Effects
// =========================================
function initCTA() {
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-primary')) {
                // Join Free button
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Creating Account...</span>';
                setTimeout(() => {
                    alert('Account creation would redirect to signup page. This is a demo.');
                    this.innerHTML = '<span>Join Free Now</span><i class="fas fa-arrow-right"></i>';
                }, 1500);
            } else {
                // Watch Video button
                alert('This would play an intro video about NeighbourShare.');
            }
        });
    });
}

// =========================================
// 9. Scroll Animations
// =========================================
function initScrollAnimations() {
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.category-card, .step-card, .impact-card, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
}

// =========================================
// 10. Animated Charts
// =========================================
function initCharts() {
    // Wait for Charts.js to load and DOM to be ready
    setTimeout(() => {
        // CO₂ Savings Chart
        const co2Ctx = document.getElementById('co2Chart').getContext('2d');
        new Chart(co2Ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'CO₂ Saved (tonnes)',
                    data: [5, 6.2, 7.5, 8.1, 9.3, 10.2],
                    borderColor: '#7ED957',
                    backgroundColor: 'rgba(126, 217, 87, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Money Saved Chart
        const moneyCtx = document.getElementById('moneyChart').getContext('2d');
        new Chart(moneyCtx, {
            type: 'bar',
            data: {
                labels: ['Tools', 'Electronics', 'Appliances', 'Sports', 'Other'],
                datasets: [{
                    label: 'Savings ($)',
                    data: [45, 30, 15, 7, 3],
                    backgroundColor: [
                        'rgba(126, 217, 87, 0.8)',
                        'rgba(159, 255, 209, 0.8)',
                        'rgba(126, 217, 87, 0.6)',
                        'rgba(159, 255, 209, 0.6)',
                        'rgba(126, 217, 87, 0.4)'
                    ],
                    borderWidth: 0,
                    borderRadius: 10
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Community Growth Chart
        const communityCtx = document.getElementById('communityChart').getContext('2d');
        new Chart(communityCtx, {
            type: 'doughnut',
            data: {
                labels: ['New Members', 'Active Lenders', 'Active Borrowers'],
                datasets: [{
                    data: [35, 40, 25],
                    backgroundColor: [
                        'rgba(126, 217, 87, 0.8)',
                        'rgba(159, 255, 209, 0.8)',
                        'rgba(126, 217, 87, 0.5)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '70%'
            }
        });
    }, 500);
}

// =========================================
// 11. Ripple Effects
// =========================================
function initRippleEffects() {
    const rippleButtons = document.querySelectorAll('.btn-ripple');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Remove any existing ripple
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }
            
            // Create ripple element
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.classList.add('ripple');
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}


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
    
    // Toggle theme on click
    themeToggle.addEventListener('click', function() {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply new theme
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
        
        // Update charts if they exist
        updateChartsForTheme(newTheme);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            root.setAttribute('data-theme', newTheme);
            updateChartsForTheme(newTheme);
        }
    });
}

function updateChartsForTheme(theme) {
    // This function would update chart colors based on theme
    // In a real implementation, you'd re-render charts with theme-appropriate colors
    console.log(`Updating charts for ${theme} theme`);
}

// Add initDarkMode to the main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoader();
    initNavbar();
    initDarkMode(); // Add this line
    initSearchBar();
    initCategorySlider();
    initHowItWorks();
    initImpactStats();
    initTestimonialsCarousel();
    initCTA();
    initScrollAnimations();
    initCharts();
    initRippleEffects();
});