import { create } from 'zustand';
import { Task, TaskPriority } from '@/types/task';

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  toggleTaskComplete: (taskId: string) => void;
  toggleSubtaskComplete: (taskId: string, subtaskId: string) => void;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (taskId) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    })),
  toggleTaskComplete: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    })),
  toggleSubtaskComplete: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : t
      ),
    })),
  clearTasks: () => set({ tasks: [] }),
}));