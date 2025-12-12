document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const imagePreview = document.getElementById('imagePreview');
    const aiSuggestions = document.getElementById('aiSuggestions');
    const listingForm = document.getElementById('listingForm');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');
    const aiTitle = document.getElementById('aiTitle');
    const aiCategory = document.getElementById('aiCategory');
    const aiDescription = document.getElementById('aiDescription');
    const itemTitle = document.getElementById('itemTitle');
    const itemCategory = document.getElementById('itemCategory');
    const itemDescription = document.getElementById('itemDescription');
    const titleCharCount = itemTitle.parentNode.querySelector('.char-count');
    const descCharCount = itemDescription.parentNode.querySelector('.char-count');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const viewListingBtn = document.getElementById('viewListingBtn');
    const listAnotherBtn = document.getElementById('listAnotherBtn');

    let uploadedImages = [];

    // Drag and Drop Functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Browse Button Click
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // File Input Change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Handle File Uploads
    function handleFiles(files) {
        if (uploadedImages.length + files.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) continue;

            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImages.push({
                    id: Date.now() + i,
                    url: e.target.result,
                    file: file
                });
                updateImagePreview();
                
                // Show AI suggestions after first image
                if (uploadedImages.length === 1) {
                    showAIProgress();
                }
            };
            reader.readAsDataURL(file);
        }
    }

    // Update Image Preview
    function updateImagePreview() {
        imagePreview.innerHTML = '';
        uploadedImages.forEach((image, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = `Uploaded image ${index + 1}`;
            
            const removeBtn = document.createElement('div');
            removeBtn.className = 'remove-image';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', () => removeImage(image.id));
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            imagePreview.appendChild(previewItem);
        });
    }

    // Remove Image
    function removeImage(id) {
        uploadedImages = uploadedImages.filter(img => img.id !== id);
        updateImagePreview();
    }

    // Show AI Progress Animation
    function showAIProgress() {
        uploadProgress.classList.add('active');
        
        setTimeout(() => {
            uploadProgress.classList.remove('active');
            aiSuggestions.style.display = 'block';
            generateAISuggestions();
        }, 2000);
    }

    // Generate AI Suggestions
    function generateAISuggestions() {
        // Simulate AI processing delay
        setTimeout(() => {
            // Update AI suggestions based on mock analysis
            const suggestions = {
                title: 'Professional Camera Lens 50mm f/1.8',
                category: 'Electronics > Photography',
                description: 'High-quality camera lens in excellent condition. Perfect for portrait photography with great bokeh effect. Includes lens cap and carrying case. Minimum borrowing period: 3 days.'
            };
            
            aiTitle.textContent = suggestions.title;
            aiCategory.textContent = suggestions.category;
            aiDescription.textContent = suggestions.description;
            
            // Add bounce animation to suggestion cards
            document.querySelectorAll('.suggestion-card').forEach(card => {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'bounce 0.5s ease';
                }, 10);
            });
        }, 500);
    }

    // Apply AI Suggestions
    document.querySelectorAll('.apply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.dataset.target;
            
            switch(target) {
                case 'title':
                    itemTitle.value = aiTitle.textContent;
                    updateCharCount(itemTitle, titleCharCount, 60);
                    break;
                case 'category':
                    // Find and select matching category
                    const categoryText = aiCategory.textContent.split(' > ')[0];
                    const options = Array.from(itemCategory.options);
                    const matchingOption = options.find(opt => 
                        opt.text.toLowerCase().includes(categoryText.toLowerCase())
                    );
                    if (matchingOption) {
                        itemCategory.value = matchingOption.value;
                    }
                    break;
                case 'description':
                    itemDescription.value = aiDescription.textContent;
                    updateCharCount(itemDescription, descCharCount, 500);
                    break;
            }
            
            // Visual feedback
            this.innerHTML = '<i class="fas fa-check"></i> Applied!';
            this.style.background = 'var(--success)';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Apply';
                this.style.background = '';
            }, 2000);
        });
    });

    // Character Count Updates
    itemTitle.addEventListener('input', () => {
        updateCharCount(itemTitle, titleCharCount, 60);
    });

    itemDescription.addEventListener('input', () => {
        updateCharCount(itemDescription, descCharCount, 500);
    });

    function updateCharCount(element, counter, max) {
        const count = element.value.length;
        counter.textContent = `${count}/${max}`;
        
        if (count > max * 0.9) {
            counter.style.color = 'var(--danger)';
        } else if (count > max * 0.75) {
            counter.style.color = 'var(--warning)';
        } else {
            counter.style.color = 'var(--gray)';
        }
    }

    // Save Draft
    saveDraftBtn.addEventListener('click', () => {
        saveDraftBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        saveDraftBtn.style.background = 'var(--success)';
        
        setTimeout(() => {
            saveDraftBtn.innerHTML = '<i class="fas fa-save"></i> Save Draft';
            saveDraftBtn.style.background = '';
        }, 2000);
        
        // In a real app, save to localStorage or send to server
        const draftData = {
            title: itemTitle.value,
            category: itemCategory.value,
            description: itemDescription.value,
            images: uploadedImages.length
        };
        localStorage.setItem('listingDraft', JSON.stringify(draftData));
    });

    // Load draft from localStorage if exists
    const savedDraft = localStorage.getItem('listingDraft');
    if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        itemTitle.value = draft.title || '';
        itemCategory.value = draft.category || '';
        itemDescription.value = draft.description || '';
        updateCharCount(itemTitle, titleCharCount, 60);
        updateCharCount(itemDescription, descCharCount, 500);
    }

    // Form Submission
    listingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (uploadedImages.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success modal
        successModal.classList.add('active');
        
        // Reset form
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-rocket"></i> Publish Listing';
    });

    // Modal Actions
    viewListingBtn.addEventListener('click', () => {
        alert('In a real app, this would redirect to the listing page');
        successModal.classList.remove('active');
    });

    listAnotherBtn.addEventListener('click', () => {
        // Reset form
        listingForm.reset();
        uploadedImages = [];
        updateImagePreview();
        aiSuggestions.style.display = 'none';
        successModal.classList.remove('active');
        updateCharCount(itemTitle, titleCharCount, 60);
        updateCharCount(itemDescription, descCharCount, 500);
        localStorage.removeItem('listingDraft');
    });

    // Close modal when clicking outside
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });

    // Add CSS animation for bounce
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 60%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            80% {
                transform: translateY(-5px);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize character counts
    updateCharCount(itemTitle, titleCharCount, 60);
    updateCharCount(itemDescription, descCharCount, 500);
});