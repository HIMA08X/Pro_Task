 
const UI = (() => {
     
    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    return {
         
        renderAnalytics: (stats) => {
            document.getElementById('statTotal').textContent = stats.total;
            document.getElementById('statCompleted').textContent = stats.completed;
            document.getElementById('statInProgress').textContent = stats.inProgress;
            document.getElementById('statPending').textContent = stats.pending;
            document.getElementById('statOverdue').textContent = stats.overdue;
            document.getElementById('statPercentage').textContent = `${stats.completionPercentage}%`;
        },

         
        renderTasks: (tasks) => {
            const container = document.getElementById('tasksContainer');
            container.innerHTML = '';

            if (tasks.length === 0) {
                container.innerHTML = `<div class="empty-state">No tasks found matching your criteria.</div>`;
                return;
            }

            tasks.forEach(task => {
                const isOverdue = TaskService.isOverdue(task.dueDate, task.status);
                const card = document.createElement('div');
                card.className = `task-item ${isOverdue ? 'overdue' : ''}`;
                card.dataset.id = task.id;

                card.innerHTML = `
                    <div class="task-info">
                        <h4>${escapeHTML(task.title)}</h4>
                        <p>${escapeHTML(task.description)}</p>
                        <div class="task-meta">
                            <span class="badge badge-${task.priority.toLowerCase()}">${task.priority}</span>
                            <span class="badge">${task.status}</span>
                            <span>Due: ${task.dueDate}</span>
                            ${isOverdue ? '<span class="badge badge-overdue">OVERDUE</span>' : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        ${task.status !== 'Completed' ? `<button class="btn btn-success btn-complete">Complete</button>` : ''}
                        <button class="btn btn-secondary btn-edit">Edit</button>
                        <button class="btn btn-danger btn-delete">Delete</button>
                    </div>
                `;
                container.appendChild(card);
            });
        },

        showError: (elementId, message) => {
            document.getElementById(elementId).textContent = message;
        },

        clearErrors: () => {
            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        },

        resetForm: () => {
            document.getElementById('taskForm').reset();
            document.getElementById('taskId').value = '';
            document.getElementById('submitBtn').textContent = 'Add Task';
            document.getElementById('cancelBtn').style.display = 'none';
            UI.clearErrors();
        }
    };
})();