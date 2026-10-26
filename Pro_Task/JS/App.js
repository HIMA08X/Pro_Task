
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const titleInput = document.getElementById('taskTitle');
    const dueDateInput = document.getElementById('taskDueDate');
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const filterPriority = document.getElementById('filterPriority');
    const sortBy = document.getElementById('sortBy');
    const tasksContainer = document.getElementById('tasksContainer');
    const cancelBtn = document.getElementById('cancelBtn');

     
    const refreshUI = () => {
        const filteredTasks = TaskService.getFilteredAndSortedTasks(
            searchInput.value,
            filterStatus.value,
            filterPriority.value,
            sortBy.value
        );
        UI.renderTasks(filteredTasks);
        UI.renderAnalytics(TaskService.getAnalytics());
    };

     
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        UI.clearErrors();

        const id = document.getElementById('taskId').value;
        const title = titleInput.value.trim();
        const description = document.getElementById('taskDescription').value;
        const priority = document.getElementById('taskPriority').value;
        const status = document.getElementById('taskStatus').value;
        const dueDate = dueDateInput.value;
        const today = new Date().toISOString().split('T')[0];

        let isValid = true;

        if (!title) {
            UI.showError('titleError', 'Title is required and cannot be whitespace.');
            isValid = false;
        } else if (TaskService.isDuplicateTitle(title, id ? Number(id) : null)) {
            UI.showError('titleError', 'A task with this title already exists.');
            isValid = false;
        }

        if (!dueDate) {
            UI.showError('dueDateError', 'Due date is required.');
            isValid = false;
        } else if (!id && dueDate < today) {  
            UI.showError('dueDateError', 'Due date cannot be in the past.');
            isValid = false;
        }

        if (!isValid) return;

        if (id) {
            TaskService.updateTask(Number(id), { title, description, priority, status, dueDate });
        } else {
            TaskService.addTask(title, description, priority, status, dueDate);
        }

        UI.resetForm();
        refreshUI();
    });

     
    tasksContainer.addEventListener('click', (e) => {
        const taskCard = e.target.closest('.task-item');
        if (!taskCard) return;

        const id = Number(taskCard.dataset.id);

        if (e.target.classList.contains('btn-delete')) {
            if (confirm('Are you sure you want to delete this task?')) {
                TaskService.deleteTask(id);
                refreshUI();
            }
        } else if (e.target.classList.contains('btn-complete')) {
            TaskService.updateTask(id, { status: 'Completed' });
            refreshUI();
        } else if (e.target.classList.contains('btn-edit')) {
            const task = TaskService.getTaskById(id);
            if (task) {
                document.getElementById('taskId').value = task.id;
                titleInput.value = task.title;
                document.getElementById('taskDescription').value = task.description;
                document.getElementById('taskPriority').value = task.priority;
                document.getElementById('taskStatus').value = task.status;
                dueDateInput.value = task.dueDate;

                document.getElementById('submitBtn').textContent = 'Update Task';
                cancelBtn.style.display = 'inline-block';
            }
        }
    });

    cancelBtn.addEventListener('click', UI.resetForm);

      
    searchInput.addEventListener('input', refreshUI);
    filterStatus.addEventListener('change', refreshUI);
    filterPriority.addEventListener('change', refreshUI);
    sortBy.addEventListener('change', refreshUI);

     
    refreshUI();
});