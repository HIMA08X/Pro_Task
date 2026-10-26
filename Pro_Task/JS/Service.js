 
const TaskService = (() => {
    let tasks = [];

 
    const isTaskOverdue = (dueDate, status) => {
        if (status === 'Completed') return false;
        const today = new Date().toISOString().split('T')[0];
        return dueDate < today;
    };
 
    const priorityRank = { High: 3, Medium: 2, Low: 1 };

    return {
        getTasks: () => [...tasks],   

        addTask: (title, description, priority, status, dueDate) => {
            const newTask = {
                id: Date.now(),
                title: title.trim(),
                description: description ? description.trim() : '',
                priority,
                status,
                dueDate,
                createdAt: new Date().toISOString()
            };
            tasks.push(newTask);
            return newTask;
        },

        updateTask: (id, updatedData) => {
            tasks = tasks.map(t => t.id === id ? { ...t, ...updatedData } : t);
        },

        deleteTask: (id) => {
            tasks = tasks.filter(t => t.id !== id);
        },

        getTaskById: (id) => tasks.find(t => t.id === id),

        isDuplicateTitle: (title, excludeId = null) => {
            return tasks.some(t => t.title.toLowerCase() === title.trim().toLowerCase() && t.id !== excludeId);
        },

        getFilteredAndSortedTasks: (search, status, priority, sortBy) => {
            let result = tasks.filter(task => {
                const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
                const matchesStatus = status === 'All' || task.status === status;
                const matchesPriority = priority === 'All' || task.priority === priority;
                return matchesSearch && matchesStatus && matchesPriority;
            });

           
            return [...result].sort((a, b) => {
                if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
                if (sortBy === 'priority') return priorityRank[b.priority] - priorityRank[a.priority];
                return new Date(b.createdAt) - new Date(a.createdAt); // default: createdAt
            });
        },

         
        getAnalytics: () => {
            const initialAcc = { total: 0, completed: 0, inProgress: 0, pending: 0, overdue: 0 };
            const today = new Date().toISOString().split('T')[0];

            const stats = tasks.reduce((acc, task) => {
                acc.total++;
                if (task.status === 'Completed') acc.completed++;
                if (task.status === 'In Progress') acc.inProgress++;
                if (task.status === 'To Do') acc.pending++;
                if (task.status !== 'Completed' && task.dueDate < today) acc.overdue++;
                return acc;
            }, initialAcc);

            const completionPercentage = stats.total > 0 
                ? Math.round((stats.completed / stats.total) * 100) 
                : 0;

            return { ...stats, completionPercentage };
        },

        isOverdue: isTaskOverdue
    };
})();