let tasks = [];
loadTasks();
renderTasks();


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            if (task.dueDate) {
                task.dueDate = new Date(task.dueDate);
            }
        });
    }
}


function addTask() {
    const input = document.getElementById('todo-input');
    const dueDateInput = document.getElementById('due-date-input');
    const priorityInput = document.getElementById('priority-input');
    const recurrenceInput = document.getElementById('recurrence-input');
    
    const value = input.value.trim();
    let dueDate = dueDateInput.value;
    const priority = priorityInput.value;
    const recurrence = recurrenceInput.value;

    if (!dueDate) {
        dueDate = new Date().toISOString().split('T')[0];
        dueDateInput.value = dueDate;
    }

    if (value && dueDate) {
        tasks.push({
            id: new Date().getTime(),
            text: value,
            dueDate: new Date(dueDate),
            priority: priority,
            recurrence: recurrence,
            completed: false
        });

        input.value = "";
        dueDateInput.value = new Date().toISOString().split('T')[0];

        saveTasks();
        renderTasks();
    } else {
        alert("Task text is required!");
    }
}

function renderTasks() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');
        li.classList.add('priority-' + task.priority);
        
        li.innerHTML = `
            ${index + 1}. ${task.text}
            <div class="task-details">
                <div>Due: ${task.dueDate.toDateString()}</div>
                <div>Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</div>
                ${task.recurrence ? '<div>Recurrence: ' + task.recurrence.charAt(0).toUpperCase() + task.recurrence.slice(1) + '</div>' : ''}
            </div>
            <div>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
                <button onclick="toggleComplete(${task.id})">${task.completed ? 'Uncomplete' : 'Complete'}</button>
            </div>
        `;
        
        list.appendChild(li);
    });
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;

    const newText = prompt('Edit your task:', task.text);
    const newDate = prompt('Edit the due date (format: YYYY-MM-DD):', task.dueDate.toISOString().split('T')[0]);
    const newPriority = prompt('Edit the priority (high, medium, low):', task.priority);
    const newRecurrence = prompt('Edit the recurrence (none, daily, weekly, monthly):', task.recurrence || 'none');
    
    if (newText) task.text = newText;
    if (newDate) task.dueDate = new Date(newDate);
    if (newPriority) task.priority = newPriority;
    if (newRecurrence !== 'none') task.recurrence = newRecurrence;

    saveTasks();
    renderTasks();
}

function sortTasks() {
    const sortOption = document.getElementById('sort-options').value;

    if (sortOption === 'date') {
        tasks.sort((a, b) => a.dueDate - b.dueDate);
    } else if (sortOption === 'completed') {
        tasks.sort((a, b) => a.completed === b.completed ? 0 : a.completed ? -1 : 1);
    } else if (sortOption === 'priority') {
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    saveTasks();
    renderTasks();
}

// Load tasks from localStorage when the script runs
loadTasks();
renderTasks();

// Set today's date as default for the date input when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('due-date-input').value = today;
});
