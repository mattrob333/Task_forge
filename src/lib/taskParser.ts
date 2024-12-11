import { Task, SubTask, TaskPriority } from '@/types/task';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function parseTaskResponse(response: string): Task[] {
  const tasks: Task[] = [];
  const lines = response.split('\n').filter(line => line.trim());

  for (const line of lines) {
    const parts = line.split('|').map(part => part.trim());
    if (parts.length >= 5) {
      const [titlePart, description, department, role, expertise] = parts;
      const title = titlePart.split(':').slice(1).join(':').trim();

      const task: Task = {
        id: generateId(),
        title,
        description,
        department: department.replace('Department:', '').trim(),
        role: role.replace('Role:', '').trim(),
        expertise: expertise.replace('Expertise:', '').trim(),
        subtasks: [], // Initialize with empty subtasks
        completed: false,
        createdAt: new Date(),
        priority: 'medium' as TaskPriority
      };

      tasks.push(task);
    }
  }

  return tasks;
}