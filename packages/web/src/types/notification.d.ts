export interface Notification {
  id: string;
  displayType: 'toast' | 'modal' | 'snackbar' | 'push' | 'email'; // New property to define how it's displayed
  style: 'info' | 'warning' | 'error' | 'success' | 'ai_suggestion'; // Renamed from 'type' to 'style'
  message: string;
  read: boolean;
  timestamp: string;
  action?: 'dismiss' | 'go_to_block' | 'apply_suggestion';
  metadata?: any;
  // Optional properties for modal alerts
  title?: string;
  actions?: { label: string; onClick: () => void }[];
  // Optional properties for snackbar
  actionLabel?: string;
  onActionClick?: () => void;
}
