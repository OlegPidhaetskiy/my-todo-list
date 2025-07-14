document.addEventListener('DOMContentLoaded', () => {
    const listsContainer = document.querySelector('.app-container__lists-grid');
    const addListButton = document.querySelector('.app-container__add-list-btn');

    let toDohLists = JSON.parse(localStorage.getItem('toDohLists')) || [];

    const saveLists = () => {
        localStorage.setItem('toDohLists', JSON.stringify(toDohLists));
    };

    const renderLists = () => {
        listsContainer.innerHTML = '';
        toDohLists.forEach((list, listIndex) => {
            const listElement = document.createElement('div');
            listElement.classList.add('focus-list');
            listElement.dataset.listIndex = listIndex;

            listElement.innerHTML = `
                <div class="focus-list__header">
                    <h3 class="focus-list__title">${list.name}</h3>
                    <button class="focus-list__delete-btn" data-action="delete-list">Delete List</button>
                </div>
                <input type="text" class="focus-list__task-input" placeholder="Add a new task...">
                <button class="focus-list__add-task-btn" data-action="add-task">Add Task</button>
                <ul class="focus-list__tasks-list">
                </ul>
            `;

            const tasksListElement = listElement.querySelector('.focus-list__tasks-list');
            list.tasks.forEach((task, taskIndex) => {
                const taskElement = document.createElement('li');
                taskElement.classList.add('task-item');
                taskElement.dataset.taskIndex = taskIndex;
                taskElement.innerHTML = `
                    <span class="task-item__text ${task.completed ? 'task-item__text--completed' : ''}">${task.text}</span>
                    <button class="task-item__delete-btn" data-action="delete-task">Delete</button>
                `;
                tasksListElement.appendChild(taskElement);
            });

            listsContainer.appendChild(listElement);
        });
    };

    addListButton.addEventListener('click', () => {
        const listName = prompt('Enter the name for your new focus list:');
        if (listName && listName.trim() !== '') {
            toDohLists.push({ name: listName.trim(), tasks: [] });
            saveLists();
            renderLists();
        }
    });

    listsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const listElement = target.closest('.focus-list');

        if (!listElement) return;

        const listIndex = parseInt(listElement.dataset.listIndex);
        const currentList = toDohLists[listIndex];

        if (target.dataset.action === 'add-task') {
            const taskInput = listElement.querySelector('.focus-list__task-input');
            const taskText = taskInput.value.trim();
            if (taskText) {
                currentList.tasks.push({ text: taskText, completed: false });
                saveLists();
                renderLists();
            }
            taskInput.value = '';
        } else if (target.dataset.action === 'delete-task') {
            const taskElement = target.closest('.task-item');
            const taskIndex = parseInt(taskElement.dataset.taskIndex);
            currentList.tasks.splice(taskIndex, 1);
            saveLists();
            renderLists();
        } else if (target.dataset.action === 'delete-list') {
            const confirmDelete = confirm(`Are you sure you want to delete "${currentList.name}" focus list?`);
            if (confirmDelete) {
                toDohLists.splice(listIndex, 1);
                saveLists();
                renderLists();
            }
        } else if (target.classList.contains('task-item__text')) {
            const taskElement = target.closest('.task-item');
            const taskIndex = parseInt(taskElement.dataset.taskIndex);
            currentList.tasks[taskIndex].completed = !currentList.tasks[taskIndex].completed;
            saveLists();
            renderLists();
        }
    });

    renderLists();
});