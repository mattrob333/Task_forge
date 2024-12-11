import { useSettings } from '@/store/settingsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

export function ActionsSettings() {
  const { actions, updateAction, toggleAction } = useSettings();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Action Webhooks</h2>
      <p className="text-sm text-muted-foreground">
        Configure webhook URLs for different actions. These will be triggered when you click the respective action buttons.
      </p>
      
      <div className="space-y-4">
        {actions.map((action) => (
          <Card key={action.id} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${action.id}-name`}>{action.name}</Label>
                <Switch
                  id={`${action.id}-enabled`}
                  checked={action.enabled}
                  onCheckedChange={() => toggleAction(action.id)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`${action.id}-webhook`}>Webhook URL</Label>
                <Input
                  id={`${action.id}-webhook`}
                  type="url"
                  placeholder="https://make.com/webhook/..."
                  value={action.webhookUrl}
                  onChange={(e) => updateAction(action.id, { webhookUrl: e.target.value })}
                  disabled={!action.enabled}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
