'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface Operation {
  id: string;
  type: 'insert' | 'delete' | 'update';
  position: number;
  content?: string;
  length?: number;
  timestamp: number;
  userId: string;
  version: number;
}

interface User {
  id: string;
  name: string;
  color: string;
  cursor?: { position: number; timestamp: number };
}

interface CollaborationContextType {
  users: User[];
  currentUser: User | null;
  operations: Operation[];
  applyOperation: (operation: Operation) => void;
  transformOperation: (operation: Operation, concurrentOps: Operation[]) => Operation;
  isOnline: boolean;
  joinSession: (userName: string) => void;
  leaveSession: () => void;
  updateCursor: (position: number) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

// Mock WebSocket for demonstration
class MockWebSocket {
  onmessage: ((event: any) => void) | null = null;
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;

  send(data: string) {
    // Simulate network delay
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({ data });
      }
    }, 100);
  }

  close() {
    if (this.onclose) {
      this.onclose();
    }
  }
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

export const CollaborationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [documentVersion, setDocumentVersion] = useState(0);

  const wsRef = useRef<MockWebSocket | null>(null);
  const userIdRef = useRef<string>('');

  // Generate unique user ID
  useEffect(() => {
    userIdRef.current = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const joinSession = useCallback((userName: string) => {
    const user: User = {
      id: userIdRef.current,
      name: userName,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    setCurrentUser(user);
    setUsers(prev => [...prev, user]);
    setIsOnline(true);

    // Initialize WebSocket connection
    wsRef.current = new MockWebSocket();
    wsRef.current.onopen = () => {
      console.log('Collaboration session joined');
    };
    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleIncomingMessage(data);
      } catch (error) {
        console.error('Failed to parse collaboration message:', error);
      }
    };
  }, []);

  const leaveSession = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setCurrentUser(null);
    setUsers([]);
    setIsOnline(false);
    setOperations([]);
  }, []);

  const handleIncomingMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'user_joined':
        setUsers(prev => [...prev, data.user]);
        break;
      case 'user_left':
        setUsers(prev => prev.filter(u => u.id !== data.userId));
        break;
      case 'operation':
        applyRemoteOperation(data.operation);
        break;
      case 'cursor_update':
        updateUserCursor(data.userId, data.position);
        break;
    }
  }, []);

  const applyRemoteOperation = useCallback((operation: Operation) => {
    // Transform operation against concurrent operations
    const transformedOp = transformOperation(operation, operations.filter(op =>
      op.timestamp > operation.timestamp && op.userId !== operation.userId
    ));

    setOperations(prev => [...prev, transformedOp]);
    setDocumentVersion(prev => prev + 1);
  }, [operations]);

  const updateUserCursor = useCallback((userId: string, position: number) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, cursor: { position, timestamp: Date.now() } }
        : user
    ));
  }, []);

  const updateCursor = useCallback((position: number) => {
    if (!currentUser || !wsRef.current) return;

    const cursorUpdate = {
      type: 'cursor_update',
      userId: currentUser.id,
      position,
    };

    wsRef.current.send(JSON.stringify(cursorUpdate));
    updateUserCursor(currentUser.id, position);
  }, [currentUser]);

  const applyOperation = useCallback((operation: Operation) => {
    if (!currentUser) return;

    const fullOperation: Operation = {
      ...operation,
      userId: currentUser.id,
      version: documentVersion,
    };

    // Apply locally first
    setOperations(prev => [...prev, fullOperation]);
    setDocumentVersion(prev => prev + 1);

    // Send to other users
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'operation',
        operation: fullOperation,
      }));
    }
  }, [currentUser, documentVersion]);

  const transformOperation = useCallback((operation: Operation, concurrentOps: Operation[]): Operation => {
    let transformedOp = { ...operation };

    for (const concurrentOp of concurrentOps) {
      if (concurrentOp.position <= transformedOp.position) {
        if (concurrentOp.type === 'insert') {
          transformedOp.position += concurrentOp.content?.length || 0;
        } else if (concurrentOp.type === 'delete') {
          const deleteLength = concurrentOp.length || 0;
          if (transformedOp.position <= concurrentOp.position + deleteLength) {
            // Operation is within deleted range - mark as no-op
            transformedOp.type = 'update';
            transformedOp.content = '';
          } else {
            transformedOp.position -= deleteLength;
          }
        }
      }
    }

    return transformedOp;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const value = {
    users,
    currentUser,
    operations,
    applyOperation,
    transformOperation,
    isOnline,
    joinSession,
    leaveSession,
    updateCursor,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};