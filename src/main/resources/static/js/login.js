// Handle form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('errorMessage');
    
    // Simple validation (no backend)
    if (username && password) {
        // Store credentials in sessionStorage (for demo purposes only)
        sessionStorage.setItem('user', JSON.stringify({
            username: username,
            lastLogin: new Date().toLocaleString()
        }));
        errorDiv.innerHTML = '<p class="success">Login successful! (Demo Mode)</p>';
        errorDiv.style.color = '#28a745';
        setTimeout(() => {
            alert('Login successful! User: ' + username);
        }, 500);
    } else {
        errorDiv.innerHTML = '<p class="error">Please enter both username and password</p>';
    }
});

// Social login handlers
function handleGoogleLogin() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = '<p class="success">Redirecting to Google... (Demo)</p>';
    errorDiv.style.color = '#28a745';
    setTimeout(() => {
        alert('Google login would redirect to: https://accounts.google.com/o/oauth2/v2/auth');
    }, 500);
}

function handleFacebookLogin() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = '<p class="success">Redirecting to Facebook... (Demo)</p>';
    errorDiv.style.color = '#28a745';
    setTimeout(() => {
        alert('Facebook login would redirect to: https://www.facebook.com/v18.0/dialog/oauth');
    }, 500);
}
