async function registerUser(event) {
    event.preventDefault();

    // Collect input values
    const fullName = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const role = document.getElementById('registerRole').value.trim();
    // Simple input validation
    if (!fullName || !email || !password || !role) {
        displayMessage('registerMessage', 'All fields are required.', 'red');
        return;
    }

    try {
        // Make POST request to backend for registration
        const response = await axios.post('http://localhost:8082/api/auth/register', {
            fullName,
            email,
            password,
            role
        });

        // Handle success response
        if (response.status === 200 || response.status === 201) {
            displayMessage('registerMessage', 'Registration successful!', 'green');
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            displayMessage('registerMessage', 'Registration failed. Please try again.', 'red');
        }
    } catch (error) {
        console.error('Registration error:', error);
        handleError(error, 'registerMessage');
    }
}

async function loginUser(event) {
    event.preventDefault();

    // Collect input values
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    // Simple input validation
    if (!email || !password) {
        displayMessage('loginMessage', 'Email and password are required.', 'red');
        return;
    }

    try {
        // Make POST request to backend for login
        const response = await axios.post('http://localhost:8082/api/auth/login', { email, password });

        // Handle success response
        if (response.status === 200) {
            displayMessage('loginMessage', 'Login successful!', 'green');
            // Store authentication status and redirect to dashboard
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userId', response.data.user.id)
            localStorage.setItem('token', response.data.token)
            console.log(response)
            if(response.data.user.role === 'admin'){
                setTimeout(() => {
                    window.location.href = 'adminDashboard.html';

                }, 2000);
            }else{
                setTimeout(() => {
                    window.location.href = 'userDashboard.html';
                }, 2000);
            }
        } else if (response.status === 401) {
            displayMessage('loginMessage', 'Invalid credentials. Please try again.', 'red');
        } else {
            displayMessage('loginMessage', 'Login failed. Please try again.', 'red');
        }
    } catch (error) {
        console.error('Login error:', error);
        handleError(error, 'loginMessage');
    }
}

function displayMessage(elementId, message, color) {
    const messageElement = document.getElementById(elementId);
    messageElement.innerText = message;
    messageElement.style.color = color;
}

function handleError(error, elementId) {
    const messageElement = document.getElementById(elementId);
    
    // Handle different error scenarios
    if (error.response) {
        // Server responded with a status other than 2xx
        messageElement.innerText = `Error: ${error.response.data.message || 'An error occurred. Please try again.'}`;
    } else if (error.request) {
        // Request was made, but no response was received
        messageElement.innerText = 'Server did not respond. Please try again later.';
    } else {
        // Something else happened
        messageElement.innerText = 'An unexpected error occurred. Please try again.';
    }
    messageElement.style.color = 'red';
}
