import React, { useState, useEffect, useCallback } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  mobileCollaboration,
  CollaborationSession,
  Collaborator,
  CursorPosition
} from '../lib/mobileCollaboration';

interface CollaborationPanelProps {
  isVisible: boolean;
  onClose: () => void;
  documentId: string;
  currentUserId: string;
  currentUserName: string;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  isVisible,
  onClose,
  documentId,
  currentUserId,
  currentUserName,
}) => {
  const { themeStyles } = useTheme();
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [cursors, setCursors] = useState<CursorPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    if (isVisible && documentId) {
      initializeCollaboration();
    }
  }, [isVisible, documentId]);

  const initializeCollaboration = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to find existing session or create new one
      const existingSession = mobileCollaboration.getSession(documentId);
      let activeSession: CollaborationSession;

      if (existingSession && existingSession.isActive) {
        // Join existing session
        activeSession = await mobileCollaboration.joinSession(existingSession.id, currentUserId, currentUserName);
      } else {
        // Create new session
        activeSession = await mobileCollaboration.createSession(documentId, currentUserId, currentUserName);
      }

      setSession(activeSession);

      // Set up real-time updates
      mobileCollaboration.addEventListener(activeSession.id, handleCollaborationEvent);

      // Get initial cursors
      setCursors(mobileCollaboration.getCursors(activeSession.id));

    } catch (error) {
      console.error('Failed to initialize collaboration:', error);
      Alert.alert('Error', 'Failed to start collaboration session');
    } finally {
      setIsLoading(false);
    }
  }, [documentId, currentUserId, currentUserName]);

  const handleCollaborationEvent = useCallback((event: any) => {
    switch (event.type) {
      case 'join':
        // Refresh session data
        const updatedSession = mobileCollaboration.getSession(session?.id || '');
        if (updatedSession) {
          setSession(updatedSession);
        }
        break;
      case 'leave':
        // Refresh session data
        const refreshedSession = mobileCollaboration.getSession(session?.id || '');
        if (refreshedSession) {
          setSession(refreshedSession);
        }
        break;
      case 'cursor':
        // Update cursors
        setCursors(mobileCollaboration.getCursors(session?.id || ''));
        break;
    }
  }, [session]);

  const handleInviteCollaborator = async () => {
    if (!inviteEmail.trim() || !session) return;

    try {
      // In a real implementation, this would send an invitation
      // For now, we'll simulate adding a collaborator
      Alert.alert('Success', `Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to send invitation');
    }
  };

  const handleLeaveSession = async () => {
    if (!session) return;

    Alert.alert(
      'Leave Session',
      'Are you sure you want to leave the collaboration session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await mobileCollaboration.leaveSession(session.id, currentUserId);
              setSession(null);
              setCursors([]);
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to leave session');
            }
          }
        }
      ]
    );
  };

  const renderCollaborator = ({ item }: { item: Collaborator }) => (
    <View style={[styles.collaboratorItem, themeStyles.card]}>
      <View style={styles.collaboratorInfo}>
        <View style={[styles.collaboratorAvatar, { backgroundColor: getCollaboratorColor(item.id) }]}>
          <Text style={styles.collaboratorInitial}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={[styles.collaboratorName, themeStyles.text]}>{item.name}</Text>
          <Text style={[styles.collaboratorStatus, themeStyles.textSecondary]}>
            {item.isOnline ? 'Online' : 'Offline'} • {item.role}
          </Text>
        </View>
      </View>
      <View style={[styles.collaboratorIndicator, { backgroundColor: item.isOnline ? '#10b981' : '#6b7280' }]} />
    </View>
  );

  const renderCursor = ({ item }: { item: CursorPosition }) => (
    <View style={[styles.cursorItem, themeStyles.card]}>
      <View style={[styles.cursorIndicator, { backgroundColor: item.color }]} />
      <View style={styles.cursorInfo}>
        <Text style={[styles.cursorUser, themeStyles.text]}>{item.userName}</Text>
        <Text style={[styles.cursorPosition, themeStyles.textSecondary]}>
          Line {item.position.line || 0}, Col {item.position.column || item.position.start}
        </Text>
      </View>
    </View>
  );

  const getCollaboratorColor = (userId: string): string => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316'];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (isLoading) {
    return (
      <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.container, styles.centered, themeStyles.background]}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={[styles.loadingText, themeStyles.text]}>Starting collaboration...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, themeStyles.background]}>
        <View style={[styles.header, themeStyles.card]}>
          <Text style={[styles.title, themeStyles.text]}>Live Collaboration</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, themeStyles.text]}>✕</Text>
          </TouchableOpacity>
        </View>

        {session && (
          <View style={styles.content}>
            {/* Session Info */}
            <View style={[styles.section, themeStyles.card]}>
              <Text style={[styles.sectionTitle, themeStyles.text]}>Session Info</Text>
              <Text style={[styles.sessionId, themeStyles.textSecondary]}>
                ID: {session.id.slice(-8)}
              </Text>
              <Text style={[styles.sessionStats, themeStyles.textSecondary]}>
                {session.collaborators.length} collaborator(s) • Started {session.createdAt.toLocaleTimeString()}
              </Text>
            </View>

            {/* Collaborators */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>Collaborators</Text>
                <TouchableOpacity
                  style={[styles.inviteButton, { backgroundColor: '#28a745' }]}
                  onPress={() => setShowInviteModal(true)}
                >
                  <Text style={styles.inviteButtonText}>Invite</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={session.collaborators}
                renderItem={renderCollaborator}
                keyExtractor={(item) => item.id}
                style={styles.collaboratorsList}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* Active Cursors */}
            {cursors.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>Active Cursors</Text>
                <FlatList
                  data={cursors}
                  renderItem={renderCursor}
                  keyExtractor={(item) => item.userId}
                  style={styles.cursorsList}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            {/* Actions */}
            <View style={[styles.actions, themeStyles.card]}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#dc3545' }]}
                onPress={handleLeaveSession}
              >
                <Text style={styles.actionButtonText}>Leave Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Invite Modal */}
        <Modal visible={showInviteModal} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.inviteModal, themeStyles.card]}>
              <Text style={[styles.modalTitle, themeStyles.text]}>Invite Collaborator</Text>
              <TextInput
                style={[styles.inviteInput, themeStyles.input]}
                placeholder="Enter email address"
                placeholderTextColor={themeStyles.textSecondary.color}
                value={inviteEmail}
                onChangeText={setInviteEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowInviteModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleInviteCollaborator}
                >
                  <Text style={styles.confirmButtonText}>Send Invite</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sessionId: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  sessionStats: {
    fontSize: 14,
  },
  inviteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  collaboratorsList: {
    maxHeight: 200,
  },
  collaboratorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  collaboratorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  collaboratorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  collaboratorInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  collaboratorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  collaboratorStatus: {
    fontSize: 12,
  },
  collaboratorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cursorsList: {
    maxHeight: 150,
  },
  cursorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  cursorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  cursorInfo: {
    flex: 1,
  },
  cursorUser: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  cursorPosition: {
    fontSize: 12,
  },
  actions: {
    padding: 16,
    borderRadius: 8,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteModal: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inviteInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  confirmButton: {
    backgroundColor: '#007bff',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CollaborationPanel;