document.addEventListener('DOMContentLoaded', function () {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // Hide or show links based on authentication status
    toggleLinks(isAuthenticated);

    // Add event listeners for login/logout and registration functionality
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

function toggleLinks(isAuthenticated) {
    const restrictedLinks = document.querySelectorAll('#navbar a[href="view-tasks.html"], #navbar a[href="view-users.html"]');
    
    restrictedLinks.forEach(link => {
        link.style.display = isAuthenticated === 'true' ? 'block' : 'none';
    });
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await axios.post('http://localhost:8082/login', { email, password });

        if (response.status === 200) {
            localStorage.setItem('isAuthenticated', 'true');
            window.location.href = 'dashboard.html'; // Redirect to dashboard upon successful login
        } else {
            displayMessage('loginMessage', 'Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        displayMessage('loginMessage', 'An error occurred during login. Please try again.');
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    try {
        const response = await axios.post('http://localhost:8082/user/registerUser', {
            username,
            email,
            password,
            role
        });

        if (response.status === 200) {
            displayMessage('registerMessage', 'Registration successful! Redirecting to login...');
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirect to login page after registration
            }, 2000);
        } else {
            displayMessage('registerMessage', 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        displayMessage('registerMessage', 'An error occurred during registration. Please try again.');
    }
}

function displayMessage(elementId, message) {
    const messageElement = document.getElementById(elementId);
    messageElement.innerText = message;
    messageElement.style.color = 'red'; // Optional: Set color for error messages
}
