import { useState } from 'react';
import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
import { Wand2, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onRemoveTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onToggleSubtask,
  onRemoveTask,
  onUpdateTask,
}: TaskListProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [guidance, setGuidance] = useState('');

  const handleGenerateActionPlan = async () => {
    try {
      setIsGenerating(true);

      // Format tasks for the prompt
      const taskDescriptions = tasks.map(task => 
        `Task: ${task.title}
Description: ${task.description}
Department: ${task.department}
Role: ${task.role}
Expertise: ${task.expertise}
---`
      ).join('\n\n');

      const response = await api.generateActionItems(
        `${taskDescriptions}\n\nPlease provide action items for each task. Use the exact task titles as headers and separate each task's action items clearly. Format as:\n\nTask: [Exact Task Title]\n1. Action item (Estimated time: X minutes)\n2. Action item (Estimated time: X minutes)\n---\n\nKeep tasks separate and maintain exact task titles.`,
        guidance
      );
      
      // Parse and update tasks with action items
      const taskBlocks = response.split('Task:').filter(Boolean);
      
      let updatedAnyTask = false;
      
      taskBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        const taskTitle = lines[0].trim();
        
        // Find exact matching task by title
        const task = tasks.find(t => 
          t.title.toLowerCase() === taskTitle.toLowerCase()
        );
        
        if (task) {
          const steps = lines.slice(1)
            .filter(line => /^\d+\./.test(line))
            .map(step => {
              // Clean up the text by removing ** and other formatting
              const content = step
                .replace(/^\d+\.\s*/, '')
                .replace(/\*\*/g, '')
                .split('(')[0]
                .trim();
              
              const timeMatch = step.match(/\(Estimated time:\s*(\d+)\s*minutes?\)/i);
              const estimatedTime = timeMatch ? parseInt(timeMatch[1]) : 30;

              return {
                id: Math.random().toString(36).substring(2),
                content,
                completed: false,
                estimatedTime
              };
            });

          if (steps.length > 0) {
            onUpdateTask(task.id, { subtasks: steps });
            updatedAnyTask = true;
          }
        }
      });

      // If any tasks didn't get action items, generate them specifically
      const unprocessedTasks = tasks.filter(task => 
        !task.subtasks || task.subtasks.length === 0
      );

      if (unprocessedTasks.length > 0) {
        try {
          const retryPrompt = `Please break down these specific tasks into detailed action items with time estimates. Format each task's steps clearly and keep them separate:

${unprocessedTasks.map(task => 
  `Task: ${task.title}
Description: ${task.description}
Department: ${task.department}
Role: ${task.role}
Expertise: ${task.expertise}
---`
).join('\n\n')}

For each task above, provide 5-10 specific action steps with time estimates. Use the exact task titles as headers and keep tasks separate.`;

          const retryResponse = await api.generateActionItems(retryPrompt, 'Focus on these specific tasks only.');

          // Process retry response
          const retryBlocks = retryResponse.split('Task:').filter(Boolean);
          
          retryBlocks.forEach(block => {
            const lines = block.trim().split('\n');
            const taskTitle = lines[0].trim();
            
            // Find exact matching task by title
            const task = unprocessedTasks.find(t => 
              t.title.toLowerCase() === taskTitle.toLowerCase()
            );
            
            if (task) {
              const steps = lines.slice(1)
                .filter(line => /^\d+\./.test(line))
                .map(step => {
                  // Clean up the text by removing ** and other formatting
                  const content = step
                    .replace(/^\d+\.\s*/, '')
                    .replace(/\*\*/g, '')
                    .split('(')[0]
                    .trim();
                  
                  const timeMatch = step.match(/\(Estimated time:\s*(\d+)\s*minutes?\)/i);
                  const estimatedTime = timeMatch ? parseInt(timeMatch[1]) : 30;

                  return {
                    id: Math.random().toString(36).substring(2),
                    content,
                    completed: false,
                    estimatedTime
                  };
                });

              if (steps.length > 0) {
                onUpdateTask(task.id, { subtasks: steps });
                updatedAnyTask = true;
              }
            }
          });
        } catch (error) {
          console.error('Error generating action items for remaining tasks:', error);
          toast.error('Failed to generate some action items. Please try again.');
        }
      }

      if (updatedAnyTask) {
        toast.success('Action items generated successfully!');
      } else {
        toast.error('Failed to generate action items. Please try again.');
      }
      setGuidance('');
    } catch (error) {
      console.error('Error generating action items:', error);
      toast.error('Failed to generate action items. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (tasks.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No tasks generated yet. Start by entering your task details above.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onToggleSubtask={onToggleSubtask}
            onRemoveTask={onRemoveTask}
            onUpdateTask={onUpdateTask}
          />
        ))}
      </div>
      
      {tasks.length > 0 && (
        <div className="space-y-4">
          <Textarea
            placeholder="Add any additional guidance or requirements for the action items..."
            value={guidance}
            onChange={(e) => setGuidance(e.target.value)}
            className="min-h-[100px]"
          />
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleGenerateActionPlan}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Action Items...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Detailed Action Plan
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}