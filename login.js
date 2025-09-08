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
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Login failed');
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('unt-email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember-me');

    // Load saved email if "Remember me" was checked
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }

    // Email validation on input
    emailInput.addEventListener('input', function() {
        hideError('email-error');
        const email = this.value.trim();
        
        if (email && !validateUNTEmail(email)) {
            showError('email-error', 'Please enter a valid @my.unt.edu email address');
        }
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Clear previous errors
        hideError('email-error');
        
        // Validate form
        let isValid = true;
        
        if (!email) {
            showError('email-error', 'Email is required');
            isValid = false;
        } else if (!validateUNTEmail(email)) {
            showError('email-error', 'Please enter a valid @my.unt.edu email address');
            isValid = false;
        }
        
        if (!password) {
            showToast('Password is required', 'error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading state
        const submitBtn = loginForm.querySelector('.signin-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;
        
        try {
            const result = await loginUser(email, password);
            
            // Store token
            localStorage.setItem('access_token', result.access_token);
            
            // Handle "Remember me"
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('remembered_email', email);
            } else {
                localStorage.removeItem('remembered_email');
            }
            
            showToast('Login successful! Redirecting...', 'success');
            
            // Redirect to main page after success
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            console.error('Login failed:', error);
            showToast(error.message || 'Login failed. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Forgot password handler
    const forgotPasswordLink = document.getElementById('forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Password reset functionality will be available soon!', 'info');
        });
    }
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