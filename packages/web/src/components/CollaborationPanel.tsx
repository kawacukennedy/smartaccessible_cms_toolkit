'use client';

import React, { useState } from 'react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { Users, UserPlus, Wifi, WifiOff, MessageCircle } from 'lucide-react';

const CollaborationPanel: React.FC = () => {
  const {
    users,
    currentUser,
    isOnline,
    joinSession,
    leaveSession
  } = useCollaboration();

  const [userName, setUserName] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleJoin = () => {
    if (userName.trim()) {
      joinSession(userName.trim());
      setShowJoinForm(false);
      setUserName('');
    }
  };

  const handleLeave = () => {
    leaveSession();
  };

  return (
    <div className="collaboration-panel card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="card-title mb-0 d-flex align-items-center">
          <Users size={16} className="me-2" />
          Collaboration
        </h6>
        <div className="d-flex align-items-center">
          {isOnline ? (
            <Wifi size={14} className="text-success me-2" />
          ) : (
            <WifiOff size={14} className="text-muted me-2" />
          )}
        </div>
      </div>

      <div className="card-body">
        {!isOnline ? (
          <div className="text-center py-4">
            <MessageCircle size={48} className="text-muted mb-3" />
            <p className="text-muted mb-3">Join a collaboration session to work with others in real-time.</p>

            {!showJoinForm ? (
              <button
                className="btn btn-primary"
                onClick={() => setShowJoinForm(true)}
              >
                <UserPlus size={16} className="me-2" />
                Join Session
              </button>
            ) : (
              <div className="join-form">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                    autoFocus
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary flex-fill"
                    onClick={handleJoin}
                    disabled={!userName.trim()}
                  >
                    Join
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowJoinForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <small className="text-muted">Online Users ({users.length})</small>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleLeave}
                  title="Leave session"
                >
                  Leave
                </button>
              </div>

              <div className="users-list">
                {users.map(user => (
                  <div
                    key={user.id}
                    className={`user-item d-flex align-items-center p-2 rounded mb-2 ${
                      user.id === currentUser?.id ? 'bg-light' : ''
                    }`}
                  >
                    <div
                      className="user-avatar me-2 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: user.color,
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold small">{user.name}</div>
                      {user.cursor && (
                        <small className="text-muted">
                          Cursor at position {user.cursor.position}
                        </small>
                      )}
                    </div>
                    {user.id === currentUser?.id && (
                      <small className="text-muted">(You)</small>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="collaboration-features">
              <h6 className="mb-2">Real-time Features</h6>
              <div className="list-group list-group-flush">
                <div className="list-group-item px-0 py-2">
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#28a745'
                        }}
                      />
                    </div>
                    <small>Live cursor tracking</small>
                  </div>
                </div>
                <div className="list-group-item px-0 py-2">
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#28a745'
                        }}
                      />
                    </div>
                    <small>Operational transforms</small>
                  </div>
                </div>
                <div className="list-group-item px-0 py-2">
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#28a745'
                        }}
                      />
                    </div>
                    <small>Conflict resolution</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationPanel;