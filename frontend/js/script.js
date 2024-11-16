// Event listeners for switching between login and register forms
document.getElementById('loginLink').addEventListener('click', showLoginForm);
document.getElementById('registerLink').addEventListener('click', showRegisterForm);

// Function to display login form
function showLoginForm() {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
        <h2>Login</h2>
        <form id="loginForm">
            <input type="email" id="loginEmail" placeholder="Email" required>
            <input type="password" id="loginPassword" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <div id="loginMessage"></div> <!-- For displaying login messages -->
        <p>Don't have an account? <a href="#" id="switchToRegister">Register here</a></p>
    `;

    // Attach loginUser function to the login form submission
    attachLoginFormListeners();
}

// Function to display registration form
function showRegisterForm() {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
        <h2>Register</h2>
        <form id="registerForm">
            <input type="text" id="registerUsername" placeholder="Username" required>
            <input type="email" id="registerEmail" placeholder="Email" required>
            <input type="password" id="registerPassword" placeholder="Password" required>
            <select id="registerRole" required>
                <option value="" disabled selected>Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit">Register</button>
        </form>
        <div id="registerMessage"></div> <!-- For displaying registration messages -->
        <p>Already have an account? <a href="#" id="switchToLogin">Login here</a></p>
    `;

    // Attach registerUser function to the registration form submission
    attachRegisterFormListeners();
}

// Function to attach login form listeners
function attachLoginFormListeners() {
    document.getElementById('loginForm').addEventListener('submit', loginUser);
    document.getElementById('switchToRegister').addEventListener('click', showRegisterForm);
}

// Function to attach registration form listeners
function attachRegisterFormListeners() {
    document.getElementById('registerForm').addEventListener('submit', registerUser);
    document.getElementById('switchToLogin').addEventListener('click', showLoginForm);
}

// Function to handle user registration
async function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    // Updated fetch request with correct endpoint `/users`
    try {
        const response = await fetch("http://localhost:8082/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,  // Using input value from the registration form
                email,
                password,
                role
            })
        });
        const data = await response.json();
        console.log("User registered:", data);
        if (response.ok) {
            // Handle successful registration (e.g., redirect or display success message)
            document.getElementById('registerMessage').innerText = "Registration successful!";
        } else {
            // Handle error response from the server
            console.error("Registration failed:", data.message);
            document.getElementById('registerMessage').innerText = "Registration failed: " + data.message;
        }
    } catch (error) {
        console.error("Error registering user:", error);
        document.getElementById('registerMessage').innerText = "Error: " + error.message;
    }
}

// Initial display of the login form
showLoginForm();
