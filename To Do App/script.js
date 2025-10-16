document.addEventListener('DOMContentLoaded', () => {

    const addTaskForm = document.getElementById('addTaskForm');
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const tasksContainer = document.getElementById('tasks-container');

    addTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskText = taskInput.value.trim();
        const taskDueDate = taskDate.value;

        if (taskText === '' || taskDueDate === '') {
            alert('Please enter both a task and a date.');
            return;
        }

        let dateGroup = document.querySelector(`[data-date="${taskDueDate}"]`);

        // This is the NEW code block
        if (!dateGroup) {
            // If no group exists for this date, create one
            const friendlyDate = new Date(taskDueDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            dateGroup = document.createElement('div');
            dateGroup.className = 'date-group';
            dateGroup.setAttribute('data-date', taskDueDate);
            dateGroup.innerHTML = `
                <h2 class="date-header">${friendlyDate}</h2>
                <ul class="task-list"></ul>
            `;

            // --- SORTING LOGIC STARTS HERE ---
            
            // 1. Get all existing date groups
            const existingGroups = tasksContainer.querySelectorAll('.date-group');
            
            // 2. Find the correct position to insert the new group
            let nextDateGroup = null;
            for (const group of existingGroups) {
                if (taskDueDate < group.dataset.date) {
                    nextDateGroup = group;
                    break; // We found the spot, no need to look further
                }
            }

            // 3. Insert the new group in the correct place
            if (nextDateGroup) {
                // If we found a group that comes after our new one, insert before it
                tasksContainer.insertBefore(dateGroup, nextDateGroup);
            } else {
                // Otherwise, it's the latest date, so add it to the end
                tasksContainer.appendChild(dateGroup);
            }
            // --- SORTING LOGIC ENDS HERE ---
        }

        // Create the new task list item (li)
        const taskList = dateGroup.querySelector('.task-list');
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <input type="checkbox" class="complete-checkbox">
            <span class="task-text">${taskText}</span>
            <div class="task-controls">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Add the new task to the list
        taskList.appendChild(taskItem);

        // Clear the input fields for the next entry
        taskInput.value = '';
        taskDate.value = '';
    });



    // ================== 3. HANDLE COMPLETION & DELETION (Event Delegation) ==================
    tasksContainer.addEventListener('click', (event) => {
        const target = event.target; // The element that was actually clicked

        // --- Handle Deleting a Task ---
        if (target.classList.contains('delete-btn')) {
    
            const taskItem = target.closest('.task-item');
            const taskList = taskItem.parentElement; // This is the <ul>
            const dateGroup = taskList.parentElement; // This is the <div class="date-group">

            // Remove the task item
            taskItem.remove();

            // Check if the task list is now empty
            if (taskList.children.length === 0) {
                // If it is, remove the entire date group (heading and list)
                dateGroup.remove();
            }
        }


        // --- Handle Editing a Task (Corrected Logic) ---
        if (target.classList.contains('edit-btn')) {
            const taskItem = target.closest('.task-item');
            // First, check if we are already in edit mode by looking for an input
            const inputField = taskItem.querySelector('input[type="text"]');

            if (inputField) {
                // --- SAVE MODE ---
                // We are already in edit mode, so save the changes.
                const newText = inputField.value.trim();
                
                // Create a brand new span to replace the input
                const newSpan = document.createElement('span');
                newSpan.className = 'task-text';
                newSpan.textContent = newText;

                // If the user saved an empty task, restore the original text
                if (newText === '') {
                    newSpan.textContent = inputField.defaultValue; // We'll add defaultValue below
                }

                // Replace the input field with our new span
                inputField.replaceWith(newSpan);
                target.textContent = 'Edit'; // Change button text back

            } else {
                // --- EDIT MODE ---
                // We are not in edit mode, so switch to it.
                const taskTextSpan = taskItem.querySelector('.task-text');
                const currentText = taskTextSpan.textContent;

                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = currentText;
                editInput.defaultValue = currentText; // Store the original text in case of empty save

                // Replace the span with the new input field
                taskTextSpan.replaceWith(editInput);
                editInput.focus(); // Focus the cursor in the input field
                target.textContent = 'Save'; // Change button text
            }
        }

        // --- Handle Completing a Task ---
        if (target.classList.contains('complete-checkbox')) {
            const taskItem = target.closest('.task-item'); // Find the parent li
            taskItem.classList.toggle('completed'); // Add or remove the 'completed' class
        }
    });

});