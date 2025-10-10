// Mobile Real-time Collaboration System
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Collaborator {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  lastActive: Date;
  isOnline: boolean;
}

export interface CollaborationSession {
  id: string;
  documentId: string;
  collaborators: Collaborator[];
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export interface CollaborationEvent {
  id: string;
  sessionId: string;
  userId: string;
  type: 'join' | 'leave' | 'edit' | 'comment' | 'cursor' | 'selection';
  data: any;
  timestamp: Date;
}

export interface CursorPosition {
  userId: string;
  userName: string;
  position: {
    start: number;
    end: number;
    line?: number;
    column?: number;
  };
  color: string;
}

export class MobileCollaborationService {
  private static instance: MobileCollaborationService;
  private sessions: Map<string, CollaborationSession> = new Map();
  private eventListeners: Map<string, ((event: CollaborationEvent) => void)[]> = new Map();
  private cursors: Map<string, CursorPosition[]> = new Map();
  private websocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {
    this.initializeCollaboration();
  }

  static getInstance(): MobileCollaborationService {
    if (!MobileCollaborationService.instance) {
      MobileCollaborationService.instance = new MobileCollaborationService();
    }
    return MobileCollaborationService.instance;
  }

  private async initializeCollaboration(): Promise<void> {
    try {
      // Load persisted sessions
      const sessionsData = await AsyncStorage.getItem('@collaboration_sessions');
      if (sessionsData) {
        const sessions = JSON.parse(sessionsData);
        sessions.forEach((session: any) => {
          this.sessions.set(session.id, {
            ...session,
            createdAt: new Date(session.createdAt),
            lastActivity: new Date(session.lastActivity),
            collaborators: session.collaborators.map((c: any) => ({
              ...c,
              lastActive: new Date(c.lastActive)
            }))
          });
        });
      }

      // Initialize WebSocket connection for real-time sync
      this.connectWebSocket();
    } catch (error) {
      console.error('Error initializing collaboration:', error);
    }
  }

  private connectWebSocket(): void {
    try {
      // In a real implementation, this would connect to your WebSocket server
      // For now, we'll simulate the connection
      this.websocket = {
        send: (data: string) => {
          // Simulate sending data
          console.log('WebSocket send:', data);
        },
        close: () => {
          this.websocket = null;
        },
        addEventListener: (event: string, handler: any) => {
          // Simulate event handling
        }
      } as any;

      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connectWebSocket();
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    }
  }

  // Session Management
  async createSession(documentId: string, userId: string, userName: string): Promise<CollaborationSession> {
    const session: CollaborationSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      documentId,
      collaborators: [{
        id: userId,
        email: '', // Would be populated from user profile
        name: userName,
        role: 'owner',
        lastActive: new Date(),
        isOnline: true
      }],
      isActive: true,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.sessions.set(session.id, session);
    await this.persistSessions();

    // Emit session created event
    this.emitEvent({
      id: `event_${Date.now()}`,
      sessionId: session.id,
      userId,
      type: 'join',
      data: { userName },
      timestamp: new Date()
    });

    return session;
  }

  async joinSession(sessionId: string, userId: string, userName: string): Promise<CollaborationSession | null> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      return null;
    }

    // Check if user is already in session
    const existingCollaborator = session.collaborators.find(c => c.id === userId);
    if (existingCollaborator) {
      existingCollaborator.lastActive = new Date();
      existingCollaborator.isOnline = true;
    } else {
      session.collaborators.push({
        id: userId,
        email: '',
        name: userName,
        role: 'editor',
        lastActive: new Date(),
        isOnline: true
      });
    }

    session.lastActivity = new Date();
    await this.persistSessions();

    // Emit join event
    this.emitEvent({
      id: `event_${Date.now()}`,
      sessionId,
      userId,
      type: 'join',
      data: { userName },
      timestamp: new Date()
    });

    return session;
  }

  async leaveSession(sessionId: string, userId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const collaborator = session.collaborators.find(c => c.id === userId);
    if (collaborator) {
      collaborator.isOnline = false;
      collaborator.lastActive = new Date();
    }

    session.lastActivity = new Date();

    // Check if session should be ended (no online collaborators)
    const onlineCollaborators = session.collaborators.filter(c => c.isOnline);
    if (onlineCollaborators.length === 0) {
      session.isActive = false;
    }

    await this.persistSessions();

    // Emit leave event
    this.emitEvent({
      id: `event_${Date.now()}`,
      sessionId,
      userId,
      type: 'leave',
      data: {},
      timestamp: new Date()
    });
  }

  // Real-time Collaboration
  updateCursor(sessionId: string, userId: string, userName: string, position: CursorPosition['position']): void {
    const cursors = this.cursors.get(sessionId) || [];
    const existingCursorIndex = cursors.findIndex(c => c.userId === userId);

    const cursor: CursorPosition = {
      userId,
      userName,
      position,
      color: this.generateCursorColor(userId)
    };

    if (existingCursorIndex >= 0) {
      cursors[existingCursorIndex] = cursor;
    } else {
      cursors.push(cursor);
    }

    this.cursors.set(sessionId, cursors);

    // Emit cursor event
    this.emitEvent({
      id: `event_${Date.now()}`,
      sessionId,
      userId,
      type: 'cursor',
      data: cursor,
      timestamp: new Date()
    });
  }

  getCursors(sessionId: string): CursorPosition[] {
    return this.cursors.get(sessionId) || [];
  }

  broadcastEdit(sessionId: string, userId: string, editData: any): void {
    this.emitEvent({
      id: `event_${Date.now()}`,
      sessionId,
      userId,
      type: 'edit',
      data: editData,
      timestamp: new Date()
    });
  }

  broadcastComment(sessionId: string, userId: string, commentData: any): void {
    this.emitEvent({
      id: `event_${Date.now()}`,
      sessionId,
      userId,
      type: 'comment',
      data: commentData,
      timestamp: new Date()
    });
  }

  // Event System
  addEventListener(sessionId: string, listener: (event: CollaborationEvent) => void): void {
    const listeners = this.eventListeners.get(sessionId) || [];
    listeners.push(listener);
    this.eventListeners.set(sessionId, listeners);
  }

  removeEventListener(sessionId: string, listener: (event: CollaborationEvent) => void): void {
    const listeners = this.eventListeners.get(sessionId) || [];
    const index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners.splice(index, 1);
      this.eventListeners.set(sessionId, listeners);
    }
  }

  private emitEvent(event: CollaborationEvent): void {
    const listeners = this.eventListeners.get(event.sessionId) || [];
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in collaboration event listener:', error);
      }
    });

    // Send via WebSocket if connected
    if (this.websocket) {
      this.websocket.send(JSON.stringify(event));
    }
  }

  // Utility Methods
  getActiveSessions(): CollaborationSession[] {
    return Array.from(this.sessions.values()).filter(session => session.isActive);
  }

  getSession(sessionId: string): CollaborationSession | null {
    return this.sessions.get(sessionId) || null;
  }

  private generateCursorColor(userId: string): string {
    // Generate consistent color based on user ID
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }

  private async persistSessions(): Promise<void> {
    try {
      const sessionsData = Array.from(this.sessions.values()).map(session => ({
        ...session,
        createdAt: session.createdAt.toISOString(),
        lastActivity: session.lastActivity.toISOString(),
        collaborators: session.collaborators.map(c => ({
          ...c,
          lastActive: c.lastActive.toISOString()
        }))
      }));

      await AsyncStorage.setItem('@collaboration_sessions', JSON.stringify(sessionsData));
    } catch (error) {
      console.error('Error persisting collaboration sessions:', error);
    }
  }

  // Cleanup
  async cleanupInactiveSessions(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    const now = Date.now();
    const toRemove: string[] = [];

    for (const [sessionId, session] of this.sessions) {
      if (!session.isActive && (now - session.lastActivity.getTime()) > maxAge) {
        toRemove.push(sessionId);
      }
    }

    toRemove.forEach(sessionId => {
      this.sessions.delete(sessionId);
      this.eventListeners.delete(sessionId);
      this.cursors.delete(sessionId);
    });

    if (toRemove.length > 0) {
      await this.persistSessions();
    }
  }

  dispose(): void {
    if (this.websocket) {
      this.websocket.close();
    }
    this.sessions.clear();
    this.eventListeners.clear();
    this.cursors.clear();
  }
}

export const mobileCollaboration = MobileCollaborationService.getInstance();