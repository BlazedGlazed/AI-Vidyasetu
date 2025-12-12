// Dashboard JavaScript for NeighbourShare

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoader();
    initDarkMode();
    initSidebar();
    initNotifications();
    initProfileDropdown();
    initDynamicGreeting();
    initQuickStats();
    initCarousel();
    initCharts();
    initButtonActions();
    initQuickSearch();
    initMenuToggle();
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
        }, 1000);
    });
}

// =========================================
// 2. Dark Mode Toggle
// =========================================
function initDarkMode() {
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;
    
    if (!themeToggle) return;
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Set initial theme
    if (savedTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update charts for new theme
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
    console.log(`Updating charts for ${theme} theme`);
    // In a real implementation, you'd re-render charts with theme-appropriate colors
}

// =========================================
// 3. Sidebar Functionality
// =========================================
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const menuToggle = document.querySelector('.menu-toggle');
    
    // Toggle sidebar on button click
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            this.querySelector('i').classList.toggle('fa-chevron-left');
            this.querySelector('i').classList.toggle('fa-chevron-right');
        });
    }
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1200) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Add active class to current nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 1200) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// =========================================
// 4. Notifications
// =========================================
function initNotifications() {
    const notificationsBtn = document.getElementById('notificationsBtn');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    const markReadBtn = document.querySelector('.mark-read');
    
    if (notificationsBtn && notificationsDropdown) {
        // Toggle notifications dropdown
        notificationsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationsDropdown.classList.toggle('show');
            
            // Mark as read when opened
            if (notificationsDropdown.classList.contains('show')) {
                const unreadNotifications = document.querySelectorAll('.notification-item.unread');
                unreadNotifications.forEach(notification => {
                    notification.classList.remove('unread');
                });
                
                // Update badge
                const badge = this.querySelector('.notifications-badge');
                if (badge) {
                    badge.style.display = 'none';
                }
            }
        });
        
        // Mark all as read
        if (markReadBtn) {
            markReadBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const unreadNotifications = document.querySelectorAll('.notification-item.unread');
                unreadNotifications.forEach(notification => {
                    notification.classList.remove('unread');
                });
                
                // Update badge
                const badge = notificationsBtn.querySelector('.notifications-badge');
                if (badge) {
                    badge.style.display = 'none';
                }
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            notificationsDropdown.classList.remove('show');
        });
        
        // Prevent dropdown from closing when clicking inside
        notificationsDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// =========================================
// 5. Profile Dropdown
// =========================================
function initProfileDropdown() {
    const profileToggle = document.getElementById('profileToggle');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            profileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            profileToggle.classList.remove('active');
            profileDropdown.classList.remove('show');
        });
        
        // Prevent dropdown from closing when clicking inside
        profileDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// =========================================
// 6. Dynamic Greeting
// =========================================
function initDynamicGreeting() {
    const greetingElement = document.getElementById('dynamicGreeting');
    if (!greetingElement) return;
    
    const hour = new Date().getHours();
    let greeting = '';
    let userName = 'Alex'; // In a real app, get from user data
    
    if (hour < 12) {
        greeting = `Good Morning, ${userName}!`;
    } else if (hour < 18) {
        greeting = `Good Afternoon, ${userName}!`;
    } else {
        greeting = `Good Evening, ${userName}!`;
    }
    
    greetingElement.textContent = greeting;
    
    // Add animation
    greetingElement.style.opacity = '0';
    greetingElement.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        greetingElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        greetingElement.style.opacity = '1';
        greetingElement.style.transform = 'translateY(0)';
    }, 500);
}

// =========================================
// 7. Quick Stats Animation
// =========================================
function initQuickStats() {
    const statValues = [
        { id: 'moneySaved', target: 1250 },
        { id: 'itemsBorrowed', target: 24 },
        { id: 'itemsLent', target: 18 },
        { id: 'co2Saved', target: 42 }
    ];
    
    // Animate stats counting up
    statValues.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (!element) return;
        
        animateCounter(element, 0, stat.target, 2000);
    });
}

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        element.textContent = value.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// =========================================
// 8. Carousel Functionality
// =========================================
function initCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    const cards = document.querySelectorAll('.borrowed-card');
    
    if (!carouselContainer || !cards.length) return;
    
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 20; // width + gap
    const visibleCards = Math.floor(carouselContainer.offsetWidth / cardWidth);
    const totalSlides = Math.ceil(cards.length / visibleCards);
    
    // Set initial active indicator
    updateIndicators();
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % totalSlides;
            scrollToSlide(currentIndex);
            updateIndicators();
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
            scrollToSlide(currentIndex);
            updateIndicators();
        });
    }
    
    // Indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentIndex = index;
            scrollToSlide(currentIndex);
            updateIndicators();
        });
    });
    
    // Auto slide every 8 seconds
    let autoSlide = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        scrollToSlide(currentIndex);
        updateIndicators();
    }, 8000);
    
    // Pause auto-slide on hover
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carouselContainer.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            scrollToSlide(currentIndex);
            updateIndicators();
        }, 8000);
    });
    
    function scrollToSlide(index) {
        const scrollAmount = index * cardWidth * visibleCards;
        carouselContainer.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
    
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
}

// =========================================
// 9. Charts
// =========================================
function initCharts() {
    // Wait for Charts.js to load
    setTimeout(() => {
        // Mini Charts for Stats
        initMiniCharts();
        
        // Activity Chart
        initActivityChart();
        
        // Category Chart
        initCategoryChart();
    }, 500);
}

function initMiniCharts() {
    // Money Saved Chart
    const moneyCtx = document.getElementById('moneyChart')?.getContext('2d');
    if (moneyCtx) {
        new Chart(moneyCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    data: [800, 850, 920, 980, 1050, 1150, 1250],
                    borderColor: '#7ED957',
                    backgroundColor: 'rgba(126, 217, 87, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }
    
    // Items Borrowed Chart
    const borrowedCtx = document.getElementById('borrowedChart')?.getContext('2d');
    if (borrowedCtx) {
        new Chart(borrowedCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    data: [18, 19, 20, 21, 22, 23, 24],
                    backgroundColor: 'rgba(159, 255, 209, 0.8)',
                    borderColor: '#9FFFD1',
                    borderWidth: 0,
                    borderRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }
    
    // Items Lent Chart
    const lentCtx = document.getElementById('lentChart')?.getContext('2d');
    if (lentCtx) {
        new Chart(lentCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    data: [12, 13, 14, 15, 16, 17, 18],
                    borderColor: '#7ED957',
                    backgroundColor: 'rgba(126, 217, 87, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }
    
    // CO₂ Saved Chart
    const co2Ctx = document.getElementById('co2Chart')?.getContext('2d');
    if (co2Ctx) {
        new Chart(co2Ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    data: [25, 28, 32, 35, 38, 40, 42],
                    borderColor: '#9FFFD1',
                    backgroundColor: 'rgba(159, 255, 209, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }
}

function initActivityChart() {
    const activityCtx = document.getElementById('activityChart')?.getContext('2d');
    if (!activityCtx) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    new Chart(activityCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Borrowed',
                    data: [3, 4, 3, 5, 4, 6, 5, 4, 5, 6, 5, 4],
                    backgroundColor: 'rgba(126, 217, 87, 0.8)',
                    borderRadius: 6
                },
                {
                    label: 'Lent',
                    data: [2, 3, 2, 4, 3, 5, 4, 3, 4, 5, 4, 3],
                    backgroundColor: 'rgba(159, 255, 209, 0.8)',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: isDark ? '#fff' : '#333',
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: isDark ? '#aaa' : '#666'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        color: isDark ? '#aaa' : '#666',
                        stepSize: 2
                    }
                }
            }
        }
    });
}

function initCategoryChart() {
    const categoryCtx = document.getElementById('categoryChart')?.getContext('2d');
    if (!categoryCtx) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Tools', 'Electronics', 'Home', 'Sports', 'Books', 'Other'],
            datasets: [{
                data: [25, 20, 18, 15, 12, 10],
                backgroundColor: [
                    '#7ED957',
                    '#9FFFD1',
                    '#5cb83a',
                    '#4CAF50',
                    '#8BC34A',
                    '#CDDC39'
                ],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: isDark ? '#fff' : '#333',
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// =========================================
// 10. Button Actions
// =========================================
function initButtonActions() {
    // Quick Action buttons
    window.addItem = function() {
        showToast('Redirecting to Add Item page...');
        setTimeout(() => {
            window.location.href = 'add-item.html';
        }, 500);
    };
    
    window.viewItems = function() {
        showToast('Loading your items...');
        setTimeout(() => {
            window.location.href = 'my-items.html';
        }, 500);
    };
    
    window.trackBorrowing = function() {
        showToast('Opening borrowing tracker...');
        setTimeout(() => {
            window.location.href = 'borrow-tracker.html';
        }, 500);
    };
    
    window.viewCommunityStats = function() {
        showToast('Loading community statistics...');
        setTimeout(() => {
            window.location.href = 'community-stats.html';
        }, 500);
    };
    
    // Return item buttons
    document.querySelectorAll('.return-item .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemName = this.closest('.return-item').querySelector('h4').textContent;
            
            if (this.classList.contains('btn-primary')) {
                showToast(`Marked "${itemName}" as returned!`);
                this.textContent = 'Returned';
                this.classList.remove('btn-primary');
                this.classList.add('btn-outline');
                this.disabled = true;
            } else if (this.textContent.includes('Extension')) {
                showToast(`Extension requested for "${itemName}"`);
            } else if (this.textContent.includes('Reminder')) {
                showToast(`Reminder set for "${itemName}"`);
            }
        });
    });
    
    // Borrowed card buttons
    document.querySelectorAll('.borrowed-card .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.borrowed-card');
            const itemName = card.querySelector('h3').textContent;
            
            if (this.textContent.includes('Return')) {
                showToast(`Initiating return for "${itemName}"`);
                card.querySelector('.item-status').textContent = 'Return Pending';
                card.querySelector('.item-status').className = 'item-status pending';
                this.textContent = 'Return Pending';
                this.disabled = true;
            } else if (this.textContent.includes('Extend')) {
                showToast(`Requesting extension for "${itemName}"`);
            } else if (this.textContent.includes('Cancel')) {
                if (confirm(`Cancel request for "${itemName}"?`)) {
                    showToast(`Request for "${itemName}" cancelled`);
                    card.style.opacity = '0.5';
                    setTimeout(() => card.remove(), 300);
                }
            } else if (this.textContent.includes('Review')) {
                showToast(`Opening review form for "${itemName}"`);
            }
        });
    });
}

function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(126, 217, 87, 0.2);
            border-radius: var(--radius-sm);
            padding: 15px 20px;
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            animation: slideInUp 0.3s ease-out;
            max-width: 300px;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--dark);
        }
        
        .toast-content i {
            color: var(--primary);
            font-size: 18px;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =========================================
// 11. Quick Search
// =========================================
function initQuickSearch() {
    const searchInput = document.querySelector('.quick-search input');
    if (!searchInput) return;
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                showToast(`Searching for: ${query}`);
                this.value = '';
                
                // Simulate search
                setTimeout(() => {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }, 500);
            }
        }
    });
}

// =========================================
// 12. Menu Toggle Animation
// =========================================
function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Animate hamburger to X
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// =========================================
// 13. Ripple Effect for Buttons
// =========================================
document.addEventListener('click', function(e) {
    const button = e.target.closest('.btn-primary, .action-card');
    
    if (button && !button.classList.contains('no-ripple')) {
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
    
    .btn-primary, .action-card {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);