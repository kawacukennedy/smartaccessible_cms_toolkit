export interface ContentBlock {
  id: string;
  type: string;
  content: any;
  locale: string;
  metadata: any;
  seo_score: number;
  accessibility_score: number;
  inclusivity_score: number;
  created_at: Date;
  updated_at: Date;
  version: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: any;
  preferences: any;
  auth_token: string;
  refresh_token: string;
  token_expiry: Date;
  theme: string;
}

export interface AISuggestion {
  id: string;
  block_id: string;
  type: string;
  description: string;
  score: number;
  status: string;
  ai_model: string;
  editor_feedback: string;
  confidence: number;
  timestamp: Date;
}

export interface Variation {
  id: string;
  block_id: string;
  content: any;
  locale: string;
  approved: boolean;
  created_at: Date;
  version: number;
}

export interface AnalyticsRecord {
  id: string;
  block_id: string;
  user_id: string;
  metrics: any;
  timestamp: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: Date;
  type: string;
  metadata: any;
}

export interface AuditLog {
  id: string;
  entity: string;
  entity_id: string;
  action: string;
  user_id: string;
  changes: any;
  timestamp: Date;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires: Date;
  created_at: Date;
  device_info: any;
}

export interface Role {
  id: string;
  name: string;
  permissions: any;
}
