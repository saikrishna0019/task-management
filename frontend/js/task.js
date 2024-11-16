async function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '<p>Loading tasks...</p>'; // Show loading message

    try {
        const response = await axios.get('http://localhost:8082/tasks'); // Adjust endpoint if necessary
        
        // Check if the response contains tasks
        if (Array.isArray(response.data) && response.data.length > 0) {
            taskList.innerHTML = response.data.map(task => createTaskItem(task)).join('');
        } else {
            taskList.innerHTML = '<p>No tasks available.</p>'; // Message when no tasks are found
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        handleError(error, taskList);
    }
}


async function createTask(event) {
    event.preventDefault(); // Prevent the default form submission behavior (page reload)

    // Collect form data
    const taskName = document.getElementById('taskName').value.trim();
    const taskPriority = document.getElementById('taskPriority').value;
    const assignedUser = document.getElementById('assignedUser').value;
    const dueDate = document.getElementById('dueDate').value;

    // Simple validation
    if (!taskName || !taskPriority || !assignedUser || !dueDate) {
        document.getElementById('taskMessage').textContent = 'All fields are required!';
        document.getElementById('taskMessage').style.color = 'red';
        return;
    }

    // Prepare the data to send to the backend
    const taskData = {
        taskName,
        taskPriority,
        assignedUser,
        dueDate
    };

    try {
        // Send POST request to backend to create the task
        const response = await fetch('http://localhost:8082/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // If you need an authentication token
            },
            body: JSON.stringify(taskData)
        });

        // Handle response from the backend
        if (response.ok) {
            const data = await response.json();
            document.getElementById('taskMessage').textContent = 'Task created successfully!';
            document.getElementById('taskMessage').style.color = 'green';

            // Optionally, reset the form or update the UI with the new task.
            // taskForm.reset(); // To reset form fields
        } else {
            document.getElementById('taskMessage').textContent = 'Error creating task.';
            document.getElementById('taskMessage').style.color = 'red';
        }
    } catch (error) {
        document.getElementById('taskMessage').textContent = 'Network error. Please try again later.';
        document.getElementById('taskMessage').style.color = 'red';
        console.error('Error creating task:', error);
    }
}

// Function to create task item HTML
function createTaskItem(task) {
    return `
        <div class="task-item">
            <p><strong>Task:</strong> ${task.name} <br>
               <strong>Description:</strong> ${task.description} <br>
               <strong>Priority:</strong> ${task.priority} <br>
               <strong>Assigned to:</strong> ${task.assignedUser || 'Unassigned'}</p>
        </div>`;
}

// Function to handle errors
function handleError(error, taskList) {
    if (error.response) {
        // Server responded with a status other than 200
        taskList.innerHTML = `<p>Error: ${error.response.data}</p>`;
    } else if (error.request) {
        // Request was made, but no response was received
        taskList.innerHTML = '<p>Server did not respond. Please try again later.</p>';
    } else {
        // Something else happened
        taskList.innerHTML = '<p>Error loading tasks. Please try again later.</p>';
    }
}
