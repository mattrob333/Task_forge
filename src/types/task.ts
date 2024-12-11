export interface Task {
  id: string;
  title: string;
  description: string;
  department: string;
  role: string;
  expertise: string;
  subtasks: SubTask[];
  completed: boolean;
  createdAt: Date;
  priority: TaskPriority;
}

export interface SubTask {
  id: string;
  content: string;
  completed: boolean;
  estimatedTime: number;
}

export interface TaskFormData {
  text: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';