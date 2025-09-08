class UNTRateMyProfessor {
    constructor() {
        this.professors = [
            {
                id: 1,
                name: "Dr. Sarah Johnson",
                department: "Computer Science & Engineering",
                rating: 4.8,
                reviews: 42,
                wouldTakeAgain: 85,
                difficulty: 3.2,
                tags: ["clear-communication", "engaging-lectures", "fair-exams", "helpful-office-hours"],
                recentReviews: [
                    {
                        rating: 5,
                        course: "CSCE 1030",
                        grade: "A",
                        takeAgain: "yes",
                        difficulty: 3,
                        tags: ["clear-communication", "engaging-lectures"],
                        review: "Dr. Johnson is amazing! Her lectures are well-structured and she explains complex concepts clearly.",
                        date: "2024-01-15",
                        helpful: 12,
                        notHelpful: 1
                    }
                ]
            },
            {
                id: 2,
                name: "Prof. Michael Chen",
                department: "Business",
                rating: 4.2,
                reviews: 67,
                wouldTakeAgain: 72,
                difficulty: 2.8,
                tags: ["good-grader", "organized", "caring"],
                recentReviews: []
            },
            {
                id: 3,
                name: "Dr. Emily Rodriguez",
                department: "Engineering",
                rating: 4.6,
                reviews: 38,
                wouldTakeAgain: 88,
                difficulty: 3.8,
                tags: ["tough-grader", "fair-exams", "helpful-office-hours"],
                recentReviews: []
            },
            {
                id: 4,
                name: "Prof. David Wilson",
                department: "Arts & Sciences",
                rating: 3.9,
                reviews: 29,
                wouldTakeAgain: 65,
                difficulty: 3.1,
                tags: ["attendance-matters", "lots-of-assignments"],
                recentReviews: []
            },
            {
                id: 5,
                name: "Dr. Lisa Thompson",
                department: "Education",
                rating: 4.7,
                reviews: 51,
                wouldTakeAgain: 92,
                difficulty: 2.5,
                tags: ["caring", "extra-credit", "organized"],
                recentReviews: []
            }
        ];
        
        this.currentProfessor = null;
        this.selectedRating = 0;
        this.selectedTags = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.populateTopProfessors();
        this.populateAllProfessors();
        this.populateRecentReviews();
        this.checkLoginStatus();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.showPage(page);
            });
        });
        
        // Search functionality
        document.getElementById('professor-search').addEventListener('input', (e) => {
            this.searchProfessors(e.target.value);
        });
        
        document.querySelector('.search-btn').addEventListener('click', () => {
            const query = document.getElementById('professor-search').value;
            this.searchProfessors(query);
        });
        
        // Rating modal
        document.getElementById('rating-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReview();
        });
        
        // Star rating interaction
        document.querySelectorAll('#rating-stars i').forEach((star, index) => {
            star.addEventListener('click', () => {
                this.setRating(index + 1);
            });
            
            star.addEventListener('mouseenter', () => {
                this.previewRating(index + 1);
            });
        });
        
        document.getElementById('rating-stars').addEventListener('mouseleave', () => {
            this.resetRatingPreview();
        });
        
        // Tag selection
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTag(e.target.dataset.tag);
            });
        });
        
        // Filter changes
        document.getElementById('department-filter').addEventListener('change', (e) => {
            this.filterProfessors();
        });
        
        document.getElementById('rating-filter').addEventListener('change', (e) => {
            this.filterProfessors();
        });
    }
    
    showPage(pageId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });
        
        // Show page
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
    
    populateTopProfessors() {
        const container = document.getElementById('top-professors');
        const topProfessors = this.professors
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
        
        container.innerHTML = topProfessors.map(prof => this.createProfessorCard(prof)).join('');
        
        // Add click handlers
        container.querySelectorAll('.professor-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showProfessorProfile(topProfessors[index]);
            });
        });
    }
    
    populateAllProfessors() {
        const container = document.getElementById('all-professors');
        container.innerHTML = this.professors.map(prof => this.createProfessorCard(prof)).join('');
        
        container.querySelectorAll('.professor-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showProfessorProfile(this.professors[index]);
            });
        });
    }
    
    populateRecentReviews() {
        const container = document.getElementById('recent-reviews');
        const recentReviews = this.professors
            .flatMap(prof => prof.recentReviews.map(review => ({...review, professor: prof})))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        container.innerHTML = recentReviews.map(review => this.createReviewCard(review)).join('');
    }
    
    createProfessorCard(professor) {
        const tagElements = professor.tags.slice(0, 3).map(tag => 
            `<span class="tag">${this.formatTag(tag)}</span>`
        ).join('');
        
        return `
            <div class="professor-card">
                <div class="professor-card-header">
                    <div class="professor-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="professor-card-info">
                        <h3>${professor.name}</h3>
                        <p class="professor-card-dept">${professor.department}</p>
                    </div>
                </div>
                <div class="professor-card-rating">
                    <div class="stars">${this.createStars(professor.rating)}</div>
                    <span class="rating-number">${professor.rating}</span>
                    <span class="rating-count">(${professor.reviews} reviews)</span>
                </div>
                <div class="professor-card-tags">
                    ${tagElements}
                </div>
            </div>
        `;
    }
    
    createReviewCard(review) {
        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="stars">${this.createStars(review.rating)}</div>
                    <span class="review-course">${review.course}</span>
                    <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                </div>
                <p class="review-text">${review.review}</p>
                <div class="review-footer">
                    <span class="professor-name">${review.professor.name}</span>
                    <span class="review-helpful">${review.helpful} helpful</span>
                </div>
            </div>
        `;
    }
    
    createStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    formatTag(tag) {
        return tag.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    showProfessorProfile(professor) {
        this.currentProfessor = professor;
        
        // Update professor info
        document.getElementById('prof-name').textContent = professor.name;
        document.getElementById('prof-dept').textContent = professor.department;
        document.getElementById('prof-stars').innerHTML = this.createStars(professor.rating);
        document.getElementById('prof-rating').textContent = professor.rating;
        document.getElementById('prof-count').textContent = `(${professor.reviews} reviews)`;
        
        // Update stats
        document.getElementById('take-again').textContent = `${professor.wouldTakeAgain}%`;
        document.getElementById('difficulty').textContent = `${professor.difficulty}/5`;
        document.getElementById('total-reviews').textContent = professor.reviews;
        
        // Update tags
        const tagsContainer = document.getElementById('prof-tags');
        tagsContainer.innerHTML = professor.tags.map(tag => 
            `<span class="tag">${this.formatTag(tag)}</span>`
        ).join('');
        
        // Show professor page
        this.showPage('professor');
    }
    
    searchProfessors(query) {
        if (!query.trim()) {
            this.populateAllProfessors();
            return;
        }
        
        const filteredProfessors = this.professors.filter(prof => 
            prof.name.toLowerCase().includes(query.toLowerCase()) ||
            prof.department.toLowerCase().includes(query.toLowerCase())
        );
        
        const container = document.getElementById('all-professors');
        container.innerHTML = filteredProfessors.map(prof => this.createProfessorCard(prof)).join('');
        
        container.querySelectorAll('.professor-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showProfessorProfile(filteredProfessors[index]);
            });
        });
        
        this.showPage('browse');
    }
    
    filterProfessors() {
        const deptFilter = document.getElementById('department-filter').value;
        const ratingFilter = document.getElementById('rating-filter').value;
        
        let filtered = this.professors;
        
        if (deptFilter) {
            filtered = filtered.filter(prof => 
                prof.department.toLowerCase().includes(deptFilter.replace('-', ' '))
            );
        }
        
        if (ratingFilter) {
            const minRating = parseFloat(ratingFilter);
            filtered = filtered.filter(prof => prof.rating >= minRating);
        }
        
        const container = document.getElementById('all-professors');
        container.innerHTML = filtered.map(prof => this.createProfessorCard(prof)).join('');
        
        container.querySelectorAll('.professor-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showProfessorProfile(filtered[index]);
            });
        });
    }
    
    setRating(rating) {
        this.selectedRating = rating;
        this.updateRatingDisplay(rating);
        document.querySelector('.rating-text').textContent = `${rating} star${rating !== 1 ? 's' : ''}`;
    }
    
    previewRating(rating) {
        this.updateRatingDisplay(rating);
    }
    
    resetRatingPreview() {
        this.updateRatingDisplay(this.selectedRating);
        if (this.selectedRating === 0) {
            document.querySelector('.rating-text').textContent = 'Click to rate';
        }
    }
    
    updateRatingDisplay(rating) {
        document.querySelectorAll('#rating-stars i').forEach((star, index) => {
            if (index < rating) {
                star.className = 'fas fa-star';
                star.classList.add('active');
            } else {
                star.className = 'far fa-star';
                star.classList.remove('active');
            }
        });
    }
    
    toggleTag(tag) {
        const tagBtn = document.querySelector(`[data-tag="${tag}"]`);
        if (this.selectedTags.includes(tag)) {
            this.selectedTags = this.selectedTags.filter(t => t !== tag);
            tagBtn.classList.remove('selected');
        } else {
            this.selectedTags.push(tag);
            tagBtn.classList.add('selected');
        }
    }
    
    submitReview() {
        if (this.selectedRating === 0) {
            this.showToast('Please select a rating', 'error');
            return;
        }
        
        const formData = {
            rating: this.selectedRating,
            course: document.getElementById('course-taken').value,
            grade: document.getElementById('grade-received').value,
            takeAgain: document.querySelector('input[name="take-again"]:checked')?.value,
            difficulty: document.getElementById('difficulty-range').value,
            tags: this.selectedTags,
            review: document.getElementById('review-text').value
        };
        
        // Simulate review submission
        console.log('Submitting review:', formData);
        
        // Add review to current professor
        if (this.currentProfessor) {
            const newReview = {
                ...formData,
                date: new Date().toISOString().split('T')[0],
                helpful: 0,
                notHelpful: 0
            };
            
            this.currentProfessor.recentReviews.unshift(newReview);
            this.currentProfessor.reviews++;
            
            // Recalculate rating (simplified)
            const totalRating = this.currentProfessor.rating * (this.currentProfessor.reviews - 1) + this.selectedRating;
            this.currentProfessor.rating = Math.round((totalRating / this.currentProfessor.reviews) * 10) / 10;
        }
        
        this.closeRatingModal();
        this.showToast('Review submitted successfully!', 'success');
        
        // Reset form
        this.resetForm();
    }
    
    resetForm() {
        this.selectedRating = 0;
        this.selectedTags = [];
        document.getElementById('rating-form').reset();
        this.updateRatingDisplay(0);
        document.querySelector('.rating-text').textContent = 'Click to rate';
        document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('selected'));
    }
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toast-message');
        
        messageEl.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Check if user is logged in and update header
    checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('unt_logged_in');
        const userEmail = localStorage.getItem('unt_user_email');
        
        if (isLoggedIn && userEmail) {
            this.updateHeaderForLoggedInUser(userEmail);
        }
    }
    
    // Update header to show logged in user
    updateHeaderForLoggedInUser(email) {
        const userActions = document.querySelector('.user-actions');
        const userName = email.split('@')[0]; // Get username part of email
        
        userActions.innerHTML = `
            <span class="user-welcome">Welcome, ${userName}</span>
            <button class="logout-btn" onclick="window.app.logout()">Logout</button>
        `;
    }
    
    // Logout functionality
    logout() {
        localStorage.removeItem('unt_logged_in');
        localStorage.removeItem('unt_user_email');
        this.showToast('Logged out successfully', 'success');
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Modal functions (global scope for onclick handlers)
function showRatingModal() {
    document.getElementById('rating-modal').classList.add('active');
}

function closeRatingModal() {
    document.getElementById('rating-modal').classList.remove('active');
}

function showPage(pageId) {
    window.app.showPage(pageId);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new UNTRateMyProfessor();
});