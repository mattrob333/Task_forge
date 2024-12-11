import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/store/settingsStore';

export function Settings() {
  const { webhookUrl, setWebhookUrl, autoSave, toggleAutoSave } = useSettings();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your TaskForge AI preferences
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="webhook">Webhook URL</Label>
          <Input
            id="webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://make.com/webhook/..."
          />
          <p className="text-sm text-muted-foreground">
            Enter your Make.com webhook URL to enable task automation
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-save">Auto-save Tasks</Label>
            <p className="text-sm text-muted-foreground">
              Automatically save tasks to local storage
            </p>
          </div>
          <Switch
            id="auto-save"
            checked={autoSave}
            onCheckedChange={toggleAutoSave}
          />
        </div>
      </Card>
    </div>
  );
}