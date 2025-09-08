// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// Utility functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    
    if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
        toast.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
    } else {
        toastIcon.className = 'fas fa-check-circle';
        toast.style.background = 'linear-gradient(135deg, #00853E, #007B3A)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function validateUNTEmail(email) {
    return email.toLowerCase().endsWith('@my.unt.edu');
}

function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return Object.values(requirements).every(req => req);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// API calls
async function signupUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Signup failed');
        }

        return data;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('unt-email');
    const studentIdInput = document.getElementById('student-id');
    const graduationYearSelect = document.getElementById('graduation-year');
    const majorSelect = document.getElementById('major');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const termsCheckbox = document.getElementById('terms-agreement');

    // Email validation on input
    emailInput.addEventListener('input', function() {
        hideError('email-error');
        const email = this.value.trim();
        
        if (email && !validateUNTEmail(email)) {
            showError('email-error', 'Please enter a valid @my.unt.edu email address');
        }
    });

    // Password validation visual feedback
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const requirements = document.querySelectorAll('.requirements-list li');
        
        if (requirements.length > 0) {
            const checks = [
                password.length >= 8,
                /[A-Z]/.test(password),
                /[a-z]/.test(password),
                /\d/.test(password),
                /[!@#$%^&*(),.?":{}|<>]/.test(password)
            ];
            
            requirements.forEach((req, index) => {
                const icon = req.querySelector('i');
                if (checks[index]) {
                    icon.className = 'fas fa-check-circle';
                    icon.style.color = '#00853E';
                } else {
                    icon.className = 'fas fa-circle';
                    icon.style.color = '#6b7280';
                }
            });
        }
    });

    // Confirm password validation
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '#e5e7eb';
        }
    });

    // Form submission
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            first_name: firstNameInput.value.trim(),
            last_name: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            student_id: studentIdInput.value.trim(),
            graduation_year: graduationYearSelect.value,
            major: majorSelect.value,
            password: passwordInput.value,
            confirm_password: confirmPasswordInput.value
        };
        
        // Clear previous errors
        hideError('email-error');
        
        // Validate form
        let isValid = true;
        
        // Required fields validation
        if (!formData.first_name) {
            showToast('First name is required', 'error');
            isValid = false;
        }
        
        if (!formData.last_name) {
            showToast('Last name is required', 'error');
            isValid = false;
        }
        
        if (!formData.email) {
            showError('email-error', 'Email is required');
            isValid = false;
        } else if (!validateUNTEmail(formData.email)) {
            showError('email-error', 'Please enter a valid @my.unt.edu email address');
            isValid = false;
        }
        
        if (!formData.student_id) {
            showToast('Student ID is required', 'error');
            isValid = false;
        }
        
        if (!formData.graduation_year) {
            showToast('Expected graduation year is required', 'error');
            isValid = false;
        }
        
        if (!formData.major) {
            showToast('Major is required', 'error');
            isValid = false;
        }
        
        if (!formData.password) {
            showToast('Password is required', 'error');
            isValid = false;
        } else if (!validatePassword(formData.password)) {
            showToast('Password does not meet requirements', 'error');
            isValid = false;
        }
        
        if (formData.password !== formData.confirm_password) {
            showToast('Passwords do not match', 'error');
            isValid = false;
        }
        
        if (!termsCheckbox.checked) {
            showToast('Please agree to the Terms of Service and Privacy Policy', 'error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading state
        const submitBtn = signupForm.querySelector('.signup-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        try {
            // Remove confirm_password from API call
            const { confirm_password, ...apiData } = formData;
            
            const result = await signupUser(apiData);
            
            showToast('Account created successfully! Redirecting to login...', 'success');
            
            // Redirect to login page after success
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Signup failed:', error);
            showToast(error.message || 'Signup failed. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('access_token');
    if (token) {
        // Verify token with backend
        fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                // User is already logged in, redirect to main page
                window.location.href = 'index.html';
            } else {
                // Token is invalid, remove it
                localStorage.removeItem('access_token');
            }
        })
        .catch(error => {
            console.error('Auth check failed:', error);
            localStorage.removeItem('access_token');
        });
    }
}

// Check auth status on page load
checkAuthStatus();