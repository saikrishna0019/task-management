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
        <div id="loginMessage"></div>
    `;

    document.getElementById('loginForm').addEventListener('submit', loginUser);
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
        <div id="registerMessage"></div>
    `;

    document.getElementById('registerForm').addEventListener('submit', registerUser);
}

// Register User Function
// Register User Function
async function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    try {
        // Change the URL here from /register to /users
        const response = await axios.post('http://localhost:8082/users', {  // Updated endpoint
            username,
            email,
            password,
            role
        });

        handleRegisterResponse(response);
    } catch (error) {
        console.error('Registration error:', error);
        displayMessage('registerMessage', error.response?.data || 'Registration failed!');
    }
}

// Handle Registration Response
function handleRegisterResponse(response) {
    if (response.status === 200) {
        displayMessage('registerMessage', 'Registration successful!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        displayMessage('registerMessage', 'Registration failed. Please try again.');
    }
}


// Display Message Function
function displayMessage(elementId, message) {
    document.getElementById(elementId).innerText = message;
}

// Logout Function
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
});

// Fetch Assigned Tasks for User
async function fetchAssignedTasks() {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'user') {
        try {
            const response = await axios.get('http://localhost:8082/api/tasks/assignee');
            renderTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            displayMessage('taskList', 'Error fetching tasks. Please try again later.');
        }
    }
}

// Render Tasks Function
function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear previous tasks

    if (tasks.length === 0) {
        taskList.innerHTML = '<p>No assigned tasks available.</p>';
    } else {
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.innerText = `Task: ${task.name} | Priority: ${task.priority}`;
            taskList.appendChild(taskItem);
        });
    }
}

// Fetch User List for Task Assignment (Admin)
async function fetchUserList() {
    token = localStorage.getItem('token')
    try {
        const response = await fetch('http://localhost:8082/api/users/getAllUsers',{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

        data = await response.json();
        renderUserList(data);
    } catch (error) {
        console.error('Error fetching users:', error);
        displayMessage('assignedUser', 'Error fetching users.');
    }
}






// Render User List Function
function renderUserList(users) {
    const assignedUserSelect = document.getElementById('assignedUser');
    assignedUserSelect.innerHTML = ''; // Clear previous options


    if (users.length === 0) {
        assignedUserSelect.innerHTML = '<option disabled>No users available</option>';
    } else {
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.fullName;
            option.innerText = user.fullName;
            assignedUserSelect.appendChild(option);
        });
    }
}

// Call fetchAssignedTasks when userDashboard.html is loaded
if (window.location.pathname.endsWith('userDashboard.html')) {
    fetchAssignedTasks();
}

// Call fetchUserList when adminDashboard.html is loaded
if (window.location.pathname.endsWith('adminDashboard.html')) {
    fetchUserList();
}

async function loadUserTasks() {
    token = localStorage.getItem('token')
    console.log(localStorage.getItem('userId'))
    userId = localStorage.getItem('userId')

    try {
        const response = await fetch(`http://localhost:8082/api/tasks/assignee/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response)

        if (!response.status === 200) {
            throw new Error('Failed to fetch tasks');
        }


        const tasks = Array.isArray(response) ? response : response.content || [];
        const taskList = document.getElementById('taskList');

        if (!tasks || tasks.length === 0) {
            taskList.innerHTML = `
                <div class="alert alert-info" role="alert">
                    No tasks found. You're all caught up!
                </div>
            `;
            return;
        }

        // Filter tasks by status if filter is active
        const statusFilter = document.getElementById('statusFilter')?.value;
        const filteredTasks = statusFilter
            ? tasks.filter(task => task.status?.toLowerCase() === statusFilter.toLowerCase())
            : tasks;

        taskList.innerHTML = filteredTasks.map(task => `
            <div class="card task-card mb-3" data-task-id="${task.id}" data-priority="${task.priority?.toLowerCase()}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">${task.title}</h5>
                        <div>
                            <span class="badge ${getPriorityBadgeClass(task.priority)}">${task.priority || 'MEDIUM'}</span>
                            <span class="badge ${getStatusBadgeClass(task.status)}">${task.status || 'TODO'}</span>
                        </div>
                    </div>
                    <p class="card-text mt-2">${task.description || 'No description provided'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Due: ${task.dueDate ? formatDate(task.dueDate) : 'No due date'}</small>
                        <div class="btn-group">
                            ${task.status !== 'DONE' ? `
                                <button class="btn btn-sm btn-primary" onclick="updateTaskStatus(${task.id}, 'IN_PROGRESS')">
                                    Start
                                </button>
                                <button class="btn btn-sm btn-success" onclick="updateTaskStatus(${task.id}, 'DONE')">
                                    Complete
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading tasks:', error);
        document.getElementById('taskList').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Failed to load tasks. Please try again later.
            </div>
        `;
    }
}





