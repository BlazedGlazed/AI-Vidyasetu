document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper carousels
    const thumbnailSwiper = new Swiper('.thumbnail-carousel', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 5,
            }
        }
    });

    const similarItemsSwiper = new Swiper('.similar-items-carousel', {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.carousel-next',
            prevEl: '.carousel-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
            1280: {
                slidesPerView: 4,
            }
        }
    });

    // DOM Elements
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    const zoomBtn = document.getElementById('zoomBtn');
    const availabilityIndicator = document.getElementById('availabilityIndicator');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const totalDaysSpan = document.getElementById('totalDays');
    const totalCostSpan = document.getElementById('totalCost');
    const requestBorrowBtn = document.getElementById('requestBorrowBtn');
    const borrowModal = document.getElementById('borrowModal');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelRequestBtn = document.getElementById('cancelRequestBtn');
    const confirmRequestBtn = document.getElementById('confirmRequestBtn');
    const modalDatesSpan = document.getElementById('modalDates');
    const modalCostSpan = document.getElementById('modalCost');
    const viewRequestsBtn = document.getElementById('viewRequestsBtn');
    const continueBrowsingBtn = document.getElementById('continueBrowsingBtn');
    const messageLenderBtn = document.getElementById('messageLenderBtn');
    const viewProfileBtn = document.getElementById('viewProfileBtn');
    const getDirectionsBtn = document.getElementById('getDirectionsBtn');
    const mapPlaceholder = document.getElementById('mapPlaceholder');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const shareBtn = document.getElementById('shareBtn');
    const insuranceOption = document.getElementById('insuranceOption');

    // Set minimum dates for date inputs
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    endDateInput.min = today;

    // Thumbnail click handler
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const newImage = this.getAttribute('data-image');
            mainImage.src = newImage;
            
            // Add fade effect
            mainImage.style.opacity = '0.5';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 150);
        });
    });

    // Zoom button click handler
    zoomBtn.addEventListener('click', function() {
        mainImage.style.transform = mainImage.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)';
        this.innerHTML = mainImage.style.transform === 'scale(1.5)' 
            ? '<i class="fas fa-search-minus"></i>' 
            : '<i class="fas fa-search-plus"></i>';
    });

    // Availability indicator animation
    function pulseAvailability() {
        availabilityIndicator.style.transform = 'scale(1.05)';
        setTimeout(() => {
            availabilityIndicator.style.transform = 'scale(1)';
        }, 300);
    }

    // Pulse every 5 seconds
    setInterval(pulseAvailability, 5000);

    // Date calculation and price update
    function calculateDatesAndPrice() {
        if (startDateInput.value && endDateInput.value) {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            
            if (endDate >= startDate) {
                const timeDiff = endDate - startDate;
                const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
                
                if (dayDiff >= 3) { // Minimum 3 days
                    const dailyRate = 8;
                    const totalCost = dayDiff * dailyRate;
                    
                    totalDaysSpan.textContent = dayDiff;
                    totalCostSpan.textContent = `$${totalCost}`;
                    
                    // Update modal preview
                    const formattedStart = startDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    });
                    const formattedEnd = endDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    });
                    
                    modalDatesSpan.textContent = `${formattedStart} - ${formattedEnd} (${dayDiff} days)`;
                    modalCostSpan.textContent = `$${totalCost}`;
                } else {
                    totalDaysSpan.textContent = '0';
                    totalCostSpan.textContent = '$0';
                    alert('Minimum rental period is 3 days');
                }
            }
        }
    }

    startDateInput.addEventListener('change', function() {
        if (this.value) {
            const nextDay = new Date(this.value);
            nextDay.setDate(nextDay.getDate() + 1);
            endDateInput.min = nextDay.toISOString().split('T')[0];
            
            if (!endDateInput.value || new Date(endDateInput.value) < nextDay) {
                endDateInput.value = nextDay.toISOString().split('T')[0];
            }
            
            calculateDatesAndPrice();
        }
    });

    endDateInput.addEventListener('change', calculateDatesAndPrice);

    // Borrow request button click
    requestBorrowBtn.addEventListener('click', function() {
        if (!startDateInput.value || !endDateInput.value) {
            alert('Please select start and end dates');
            return;
        }
        
        const dayDiff = parseInt(totalDaysSpan.textContent);
        if (dayDiff < 3) {
            alert('Minimum rental period is 3 days');
            return;
        }
        
        borrowModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Modal close handlers
    function closeModals() {
        borrowModal.classList.remove('active');
        successModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeModalBtn.addEventListener('click', closeModals);
    cancelRequestBtn.addEventListener('click', closeModals);

    // Close modal when clicking outside
    borrowModal.addEventListener('click', function(e) {
        if (e.target === borrowModal) {
            closeModals();
        }
    });

    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModals();
        }
    });

    // Confirm borrow request
    confirmRequestBtn.addEventListener('click', function() {
        const insuranceCost = insuranceOption.checked ? 2 : 0;
        const totalCost = parseInt(totalCostSpan.textContent.replace('$', ''));
        const serviceFee = Math.round(totalCost * 0.1 * 100) / 100;
        const deposit = 50;
        const totalToPay = totalCost + serviceFee + insuranceCost;
        
        // Update button text with loading
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        this.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            borrowModal.classList.remove('active');
            successModal.classList.add('active');
            
            // Reset button
            this.innerHTML = '<i class="fas fa-lock"></i> Confirm & Pay';
            this.disabled = false;
        }, 1500);
    });

    // Success modal actions
    viewRequestsBtn.addEventListener('click', function() {
        alert('In a real app, this would redirect to your requests page');
        closeModals();
    });

    continueBrowsingBtn.addEventListener('click', function() {
        closeModals();
        // In a real app, this might scroll to similar items
        document.querySelector('.similar-items-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });

    // Lender actions
    messageLenderBtn.addEventListener('click', function() {
        alert('In a real app, this would open a chat with the lender');
    });

    viewProfileBtn.addEventListener('click', function() {
        alert('In a real app, this would open the lender\'s profile page');
    });

    // Map and directions
    getDirectionsBtn.addEventListener('click', function() {
        alert('In a real app, this would open Google Maps with directions');
    });

    mapPlaceholder.addEventListener('click', function() {
        alert('Interactive map would open here');
    });

    // Wishlist button
    let isWishlisted = false;
    wishlistBtn.addEventListener('click', function() {
        isWishlisted = !isWishlisted;
        if (isWishlisted) {
            this.innerHTML = '<i class="fas fa-heart"></i>';
            this.style.color = '#ef4444';
            // Add animation
            this.style.animation = 'heartBeat 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        } else {
            this.innerHTML = '<i class="far fa-heart"></i>';
            this.style.color = '';
        }
    });

    // Share button
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'Professional Camera Lens on ShareCircle',
                text: 'Check out this amazing camera lens available for sharing!',
                url: window.location.href,
            })
            .catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-share-alt"></i>';
            }, 2000);
        }
    });

    // Similar items carousel - item click
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', function() {
            // In a real app, this would navigate to the item page
            alert('Navigating to item details page');
        });
    });

    // Add CSS animation for heart beat
    const style = document.createElement('style');
    style.textContent = `
        @keyframes heartBeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.3); }
            50% { transform: scale(1); }
            75% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Initialize with default dates if empty
    if (!startDateInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        startDateInput.value = tomorrow.toISOString().split('T')[0];
        
        const threeDaysLater = new Date(tomorrow);
        threeDaysLater.setDate(threeDaysLater.getDate() + 2);
        endDateInput.value = threeDaysLater.toISOString().split('T')[0];
        
        calculateDatesAndPrice();
    }
});