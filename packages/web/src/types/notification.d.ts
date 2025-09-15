export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'ai_suggestion';
  message: string;
  read: boolean;
  timestamp: string;
  action?: 'dismiss' | 'go_to_block' | 'apply_suggestion';
  metadata?: any;
}
