import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { TaskFormData } from '@/types/task';

interface TaskInputProps {
  onSubmit: (data: TaskFormData) => Promise<void>;
  isLoading: boolean;
}

export function TaskInput({ onSubmit, isLoading }: TaskInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      await onSubmit({ text: text.trim() });
      setText(''); // Clear input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your task details..."
          className="min-h-[150px] resize-none"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || !text.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Add Task'
          )}
        </Button>
      </div>
    </form>
  );
}