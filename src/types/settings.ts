export interface ActionSettings {
  id: string;
  name: string;
  webhookUrl: string;
  enabled: boolean;
}

export interface AppSettings {
  actions: ActionSettings[];
}

export const defaultActions: ActionSettings[] = [
  {
    id: 'email',
    name: 'Send to Email',
    webhookUrl: '',
    enabled: true
  },
  {
    id: 'slack',
    name: 'Send to Slack',
    webhookUrl: '',
    enabled: true
  },
  {
    id: 'trello',
    name: 'Add to Trello',
    webhookUrl: '',
    enabled: true
  }
];
