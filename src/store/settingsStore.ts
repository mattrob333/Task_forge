import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ActionSettings, defaultActions } from '@/types/settings';

interface SettingsState {
  webhookUrl: string;
  autoSave: boolean;
  actions: ActionSettings[];
  setWebhookUrl: (url: string) => void;
  toggleAutoSave: () => void;
  updateAction: (actionId: string, updates: Partial<ActionSettings>) => void;
  toggleAction: (actionId: string) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      webhookUrl: '',
      autoSave: true,
      actions: defaultActions,
      setWebhookUrl: (url) => set({ webhookUrl: url }),
      toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),
      updateAction: (actionId, updates) => 
        set((state) => ({
          actions: state.actions.map(action =>
            action.id === actionId ? { ...action, ...updates } : action
          )
        })),
      toggleAction: (actionId) =>
        set((state) => ({
          actions: state.actions.map(action =>
            action.id === actionId ? { ...action, enabled: !action.enabled } : action
          )
        })),
    }),
    {
      name: 'taskforge-settings',
    }
  )
);