// Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const categorySelect = document.getElementById('category-select');
const toggleThemeBtn = document.getElementById('toggle-theme');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Load tasks
tasks.forEach(task => addTaskToDOM(task));

// Add task with button or Enter key
taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});
addTaskBtn.addEventListener('click', addTask);

function addTask() {
    const text = taskInput.value.trim();
    const category = categorySelect.value;
    if (text === '') return alert('Please enter a task!');

    const task = { text, category, completed: false };
    tasks.push(task);
    saveTasks();
    addTaskToDOM(task);
    taskInput.value = '';
}

// Add task to DOM
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.draggable = true;
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
        <span><span class="category">${task.category}</span>${task.text}</span>
        <div>
            <button class="complete-btn" aria-label="Mark task complete">✔</button>
            <button class="delete-btn" aria-label="Delete task">✖</button>
        </div>
    `;

    // Complete task
    li.querySelector('.complete-btn').addEventListener('click', () => {
        task.completed = !task.completed;
        li.classList.toggle('completed');
        saveTasks();
    });

    // Delete task
    li.querySelector('.delete-btn').addEventListener('click', () => {
        tasks = tasks.filter(t => t !== task);
        taskList.removeChild(li);
        saveTasks();
    });

    // Drag & Drop
    li.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', tasks.indexOf(task)));
    li.addEventListener('dragover', e => e.preventDefault());
    li.addEventListener('drop', e => {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData('text/plain');
        const targetIndex = tasks.indexOf(task);
        tasks.splice(targetIndex, 0, tasks.splice(draggedIndex, 1)[0]);
        saveTasks();
        renderTasks();
    });

    taskList.appendChild(li);
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => addTaskToDOM(task));
}

// Save to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Theme toggle
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggleThemeBtn.textContent = document.body.classList.contains('dark') ? '☀ Light Mode' : '🌙 Dark Mode';
});
