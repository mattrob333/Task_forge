<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delegator Bot Supreme 🤖</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .gradient-text {
            background: linear-gradient(90deg, #ff7e5f, #feb47b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .gradient-btn {
            background: linear-gradient(90deg, #ff7e5f, #feb47b);
            color: white;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto px-4 py-12">
        <h1 class="text-4xl font-bold mb-4 p-2 gradient-text text-center">Strategic Task Delegation Interface</h1>
        <h2 class="text-xl font-bold mb-4 text-center">Empower Decision-makers with AI-Persona Driven Action Plans</h2>
        <form id="taskForm" class="space-y-4">
            <label for="text" class="block">Enter your Task Details:</label>
            <textarea id="text" name="text" rows="6" class="w-full bg-gray-700 p-2 rounded"></textarea>
            <button type="submit" class="gradient-btn py-1 px-4 rounded">Generate Action Plan!</button>
        </form>
        <div id="loading" class="hidden mt-4">
            <p>Breaking down tasks...</p>
            <svg class="animate-spin h-5 w-5 mx-auto text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        <table id="output" class="hidden w-full mt-8">
            <thead>
                <tr>
                    <th class="bg-gray-700 p-2 text-left">Task</th>
                    <th class="bg-gray-700 p-2 text-left">Brief Description</th>
                    <th class="bg-gray-700 p-2 text-left">Department</th>
                    <th class="bg-gray-700 p-2 text-left">Role</th>
                    <th class="bg-gray-700 p-2 text-left">Expertise</th>
                </tr>
            </thead>
            <tbody class="bg-gray-800"></tbody>
        </table>
        <h1 class="text-4xl font-bold mt-12 mb-4 gradient-text text-center">Task Breakdown</h1>
        <form id="task-form" class="space-y-4">
            <textarea id="previous-output" placeholder="Previous steps output" class="w-full p-2 bg-gray-700 text-white rounded-lg h-32 resize-none"></textarea>
            <input type="text" id="edit-entry" placeholder="Add edits or guidance" class="w-full p-2 bg-gray-700 text-white rounded-lg">
            <button type="submit" class="gradient-btn p-2 rounded-lg w-full">Create Action Items</button>
            <div id="loading2" class="hidden">
                <p>Generating action items...</p>
                <div class="loader mx-auto my-4"></div>
            </div>
            <div id="response-container" class="py-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
        </form>
    </div>
    <footer class="bg-gray-800 text-center py-4">
        <a href="#" class="text-white">Murder those tasks 🔫</a>
    </footer>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            localStorage.removeItem('tasks');
            const taskForm = document.getElementById("taskForm");
            const loading1 = document.getElementById("loading");
            const output = document.getElementById("output");
            const outputTableBody = output.querySelector('tbody');
            const previousOutput = document.getElementById('previous-output');
            const taskForm2 = document.getElementById('task-form');
            const loading2 = document.getElementById('loading2');
            const responseContainer = document.getElementById('response-container');

            // Load tasks and subtasks from localStorage if available
            const storedTasks = localStorage.getItem('tasks');
            if (storedTasks) {
                responseContainer.innerHTML = storedTasks;
            }
            taskForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const text = document.getElementById("text").value;

                if (text) {
                    loading1.classList.remove("hidden");

                    try {
                        const prompt = `Please categorize the following text into tasks:\n${text}\n\nFor each task, please provide the following details in this format:
                        Task 1: Task Title (e.g., "Create Social Media Campaign") | Brief Description (e.g., "Plan and execute a social media campaign") | Department (e.g., "Marketing") | Role (e.g., "Social Media Manager") | Expertise (e.g., "SEO")
                        Task 2: Task Title (e.g., "Design New Logo") | Brief Description (e.g., "Design a new logo for our brand") | Department (e.g., "Design") | Role (e.g., "Graphic Designer") | Expertise (e.g., "Graphic Design")
                        ...and so on.`;
                        const response = await axios.get(`https://a.picoapps.xyz/ask-ai?prompt=${encodeURIComponent(prompt)}`);
                        
                        const tasks = response.data.response.split("\n");
                        outputTableBody.innerHTML = tasks.map(task => {
                            if (task.trim() !== '') {
                                const taskDetails = task.split(": ").slice(1).join(": ").split(" | ");
                                if (taskDetails.length < 5) {
                                    console.error(`Task "${task}" does not have the expected format.`);
                                    return '';
                                }
                                const taskTitle = taskDetails[0].trim();
                                const briefDescription = taskDetails[1].trim();
                                const department = taskDetails[2].trim();
                                const role = taskDetails[3].trim();
                                const expertise = taskDetails[4].trim();
                                return `
                                    <tr>
                                        <td class="p-2">${taskTitle}</td>
                                        <td class="p-2">${briefDescription}</td>
                                        <td class="p-2">${department.replace('Department:', '')}</td>
                                        <td class="p-2">${role.replace('Role:', '')}</td>
                                        <td class="p-2">${expertise.replace('Expertise:', '')}</td>
                                    </tr>
                                `;
                            } else {
                                return '';
                            }
                        }).join("");

                        loading1.classList.add("hidden");
                        output.classList.remove("hidden");
                        previousOutput.value = tasks.join("\n");

                        // Store tasks and subtasks in localStorage
                        localStorage.setItem('tasks', responseContainer.innerHTML);
                    } catch (error) {
                        console.error("An error occurred while processing the tasks:", error);
                        // Display error message to the user
                    }
                }
            });

            taskForm2.addEventListener('submit', async (event) => {
                event.preventDefault();
                const editEntry = document.getElementById('edit-entry').value;

                try {
                    const prompt = `Given the following tasks, please break each one down into detailed action items:\n${previousOutput.value}\n\n${editEntry}`;
                    loading2.classList.remove('hidden');
                    const response = await axios.get(`https://a.picoapps.xyz/ask-ai?prompt=${encodeURIComponent(prompt)}`);
                    loading2.classList.add('hidden');

                    const tasks = response.data.response.split('\n\n');
                    responseContainer.innerHTML = '';
                    tasks.forEach(task => {
                        const [taskTitle, ...subtasks] = task.split('\n');
                        if (taskTitle.trim() !== '') {
                            const taskDropdown = document.createElement('details');
                            taskDropdown.classList.add('bg-gray-700', 'p-4', 'rounded-lg');
                            const summary = document.createElement('summary');
                            summary.innerText = taskTitle;
                            taskDropdown.appendChild(summary);

                            const subtaskList = document.createElement('ul');
                            subtaskList.style.listStyleType = 'disc';
                            subtaskList.style.paddingLeft = '20px';

                            subtasks.forEach(subtask => {
                                if (subtask.trim() !== '') {
                                    const subtaskItem = document.createElement('li');
                                    subtaskItem.innerText = subtask;
                                    subtaskList.appendChild(subtaskItem);
                                }
                            });

                            taskDropdown.appendChild(subtaskList);

                            const copyButton = document.createElement('button');
                            copyButton.innerText = 'Copy to Clipboard';
                            copyButton.classList.add('gradient-btn', 'p-2', 'rounded-lg', 'mt-4', 'w-full', 'mb-2');  // Added 'w-full' and 'mb-2'
                            copyButton.addEventListener('click', () => {
                                const textToCopy = taskDropdown.innerText;
                                navigator.clipboard.writeText(textToCopy).then(() => {
                                    alert('Copied to clipboard!');
                                }).catch((error) => {
                                    console.error('Failed to copy to clipboard:', error);
                                });
                            });
                            taskDropdown.appendChild(copyButton);

                            const completedButton = document.createElement('button');
                            completedButton.innerText = 'Completed';
                            completedButton.classList.add('completed-button', 'bg-green-500', 'hover:bg-green-700', 'py-1', 'px-4', 'rounded', 'mt-2', 'w-full', 'mb-2');  // Added 'w-full' and 'mb-2'
                            completedButton.addEventListener('click', () => {
                                taskDropdown.remove();

                                // Update stored tasks and subtasks in localStorage
                                localStorage.setItem('tasks', responseContainer.innerHTML);
                            });
                            taskDropdown.appendChild(completedButton);

                            responseContainer.appendChild(taskDropdown);
                        }
                    });

                    // Store tasks and subtasks in localStorage
                    localStorage.setItem('tasks', responseContainer.innerHTML);
                } catch (error) {
                    console.error("An error occurred while generating action items:", error);
                    // Display error message to the user
                }
            });

            // Remove completed tasks
            outputTableBody.addEventListener('click', (event) => {
                if (event.target.classList.contains('completed-button')) {
                    const row = event.target.closest('tr');
                    row.remove();

                    // Update stored tasks and subtasks in localStorage
                    localStorage.setItem('tasks', responseContainer.innerHTML);
                }
            });
        });
    </script>


</body></html>