import { useState } from 'react';
import { Task, TaskPriority } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, Clock, Trash2, Edit2, Save, X, Send, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useSettings } from '@/store/settingsStore';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onRemoveTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskCard({
  task,
  onToggleComplete,
  onToggleSubtask,
  onRemoveTask,
  onUpdateTask,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);
  
  const priorityColors = {
    high: 'bg-red-500/10 text-red-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    low: 'bg-blue-500/10 text-blue-500',
  };

  const handleSave = () => {
    onUpdateTask(task.id, { description: editedDescription });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDescription(task.description);
    setIsEditing(false);
  };

  const handleWebhookAction = async (action: string) => {
    // TODO: Implement webhook actions
    console.log(`Executing webhook action: ${action} for task ${task.id}`);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={cn(
                "text-lg font-medium",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {useSettings().actions
                    .filter(action => action.enabled && action.webhookUrl)
                    .map(action => (
                      <DropdownMenuItem
                        key={action.id}
                        onClick={() => handleWebhookAction(action.id)}
                      >
                        {action.name}
                      </DropdownMenuItem>
                    ))
                  }
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onToggleComplete(task.id)}
              >
                <Check className={cn(
                  "h-4 w-4",
                  task.completed && "text-green-500"
                )} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => onRemoveTask(task.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Select
              defaultValue={task.priority}
              onValueChange={(value: TaskPriority) => onUpdateTask(task.id, { priority: value })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-[120px]">
                <SelectItem value="high">
                  <Badge className={priorityColors.high}>High</Badge>
                </SelectItem>
                <SelectItem value="medium">
                  <Badge className={priorityColors.medium}>Medium</Badge>
                </SelectItem>
                <SelectItem value="low">
                  <Badge className={priorityColors.low}>Low</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{task.department}</span>
          <span>•</span>
          <span>{task.role}</span>
          {task.subtasks.length > 0 && (
            <>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor(task.subtasks.reduce((acc, st) => acc + st.estimatedTime, 0) / 60)}h{' '}
                {task.subtasks.reduce((acc, st) => acc + st.estimatedTime, 0) % 60}m
              </span>
            </>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <p className="text-sm text-muted-foreground pr-8">
              {task.description}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Created {formatDistanceToNow(task.createdAt)} ago
        </p>

        {/* Action Items Section */}
        {task.subtasks.length > 0 && (
          <div className="mt-4">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span>Action Items</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            {isExpanded && (
              <div className="space-y-4 mt-2">
                <div className="pl-4 border-l-2 border-border space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onToggleSubtask(task.id, subtask.id)}
                        >
                          <Check className={cn(
                            "h-4 w-4",
                            subtask.completed && "text-green-500"
                          )} />
                        </Button>
                        <span className={cn(
                          "text-sm",
                          subtask.completed && "line-through text-muted-foreground"
                        )}>
                          {subtask.content}
                        </span>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {Math.floor(subtask.estimatedTime / 60)}h {subtask.estimatedTime % 60}m
                      </Badge>
                    </div>
                  ))}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem onClick={() => handleWebhookAction('email')}>
                      Send to Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleWebhookAction('slack')}>
                      Send to Slack
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleWebhookAction('trello')}>
                      Add to Trello
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}