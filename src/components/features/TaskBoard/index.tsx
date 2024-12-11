import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { TaskFormData } from '@/types/task';
import { parseTaskResponse } from '@/lib/taskParser';

export function TaskBoard() {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    tasks, 
    addTask, 
    removeTask, 
    toggleTaskComplete, 
    toggleSubtaskComplete, 
    clearTasks,
    updateTask 
  } = useTaskStore();

  const handleSubmit = async (data: TaskFormData) => {
    try {
      setIsLoading(true);
      
      // Clear existing tasks before generating new ones
      clearTasks();

      const prompt = `Please categorize the following text into tasks:\n${data.text}\n\nFor each task, please provide the following details in this format:
      Task: Task Title | Brief Description | Department | Role | Expertise
      
      Important: Break down the input into as many specific tasks as needed, with no limit to the number of tasks.`;
      
      const response = await api.generateTasks(prompt);
      
      if (!response) {
        throw new Error('No response from API');
      }

      const parsedTasks = parseTaskResponse(response);
      
      if (parsedTasks.length === 0) {
        throw new Error('No tasks could be generated from the response');
      }

      // Add all parsed tasks
      parsedTasks.forEach(addTask);
      toast.success(`Generated ${parsedTasks.length} tasks successfully!`);
    } catch (error) {
      console.error('Error generating tasks:', error);
      toast.error('Failed to generate tasks. Please try again.');
      clearTasks(); // Clear tasks on error to maintain consistent state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Task Board</h1>
          <p className="text-muted-foreground">
            Enter your task details below to generate an AI-powered action plan.
          </p>
        </div>

        <TaskInput onSubmit={handleSubmit} isLoading={isLoading} />
        
        <TaskList
          tasks={tasks}
          onToggleComplete={toggleTaskComplete}
          onToggleSubtask={toggleSubtaskComplete}
          onRemoveTask={removeTask}
          onUpdateTask={updateTask}
        />
      </div>
    </div>
  );
}