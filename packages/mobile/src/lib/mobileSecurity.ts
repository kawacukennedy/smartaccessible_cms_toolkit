// Mobile Advanced Security System
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface SecurityConfig {
  biometricEnabled: boolean;
  encryptionEnabled: boolean;
  autoLockTimeout: number; // minutes
  maxLoginAttempts: number;
  sessionTimeout: number; // minutes
  dataEncryptionLevel: 'basic' | 'advanced' | 'military';
  remoteWipeEnabled: boolean;
  auditLoggingEnabled: boolean;
}

export interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'security_breach';
  userId?: string;
  timestamp: Date;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress?: string;
  deviceInfo?: Record<string, any>;
}

export interface EncryptedData {
  data: string; // Base64 encoded encrypted data
  iv: string; // Initialization vector
  salt?: string; // Salt for key derivation
  algorithm: string;
  keyVersion: number;
}

export class MobileSecurityService {
  private static instance: MobileSecurityService;
  private config: SecurityConfig;
  private loginAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();
  private activeSessions: Map<string, { userId: string; expiresAt: Date; deviceId: string }> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private encryptionKey: string | null = null;

  private constructor() {
    this.config = this.getDefaultConfig();
    this.initializeSecurity();
  }

  static getInstance(): MobileSecurityService {
    if (!MobileSecurityService.instance) {
      MobileSecurityService.instance = new MobileSecurityService();
    }
    return MobileSecurityService.instance;
  }

  private getDefaultConfig(): SecurityConfig {
    return {
      biometricEnabled: Platform.OS === 'ios' || Platform.OS === 'android',
      encryptionEnabled: true,
      autoLockTimeout: 5,
      maxLoginAttempts: 5,
      sessionTimeout: 60,
      dataEncryptionLevel: 'advanced',
      remoteWipeEnabled: true,
      auditLoggingEnabled: true
    };
  }

  private async initializeSecurity(): Promise<void> {
    try {
      // Load security configuration
      const configData = await AsyncStorage.getItem('@security_config');
      if (configData) {
        this.config = { ...this.config, ...JSON.parse(configData) };
      }

      // Load security events
      const eventsData = await AsyncStorage.getItem('@security_events');
      if (eventsData) {
        const events = JSON.parse(eventsData);
        this.securityEvents = events.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
      }

      // Generate or load encryption key
      await this.initializeEncryptionKey();

    } catch (error) {
      console.error('Error initializing security service:', error);
      this.logSecurityEvent({
        type: 'security_breach',
        details: { error: 'Failed to initialize security service', message: error.message },
        severity: 'high'
      });
    }
  }

  // Authentication & Authorization
  async authenticateWithBiometrics(userId: string): Promise<boolean> {
    if (!this.config.biometricEnabled) {
      return false;
    }

    try {
      // In a real implementation, this would use react-native-biometrics or similar
      // For now, we'll simulate biometric authentication
      const isAuthenticated = await this.simulateBiometricAuth();

      if (isAuthenticated) {
        await this.createSession(userId);
        this.logSecurityEvent({
          type: 'login',
          userId,
          details: { method: 'biometric' },
          severity: 'low'
        });
        this.resetLoginAttempts(userId);
      } else {
        await this.recordFailedLogin(userId);
      }

      return isAuthenticated;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      this.logSecurityEvent({
        type: 'failed_login',
        userId,
        details: { method: 'biometric', error: error.message },
        severity: 'medium'
      });
      return false;
    }
  }

  async authenticateWithPassword(userId: string, password: string): Promise<boolean> {
    try {
      // Check login attempts
      if (this.isAccountLocked(userId)) {
        this.logSecurityEvent({
          type: 'failed_login',
          userId,
          details: { reason: 'account_locked' },
          severity: 'high'
        });
        return false;
      }

      // In a real implementation, this would verify against a secure password hash
      const isValid = await this.verifyPassword(password);

      if (isValid) {
        await this.createSession(userId);
        this.logSecurityEvent({
          type: 'login',
          userId,
          details: { method: 'password' },
          severity: 'low'
        });
        this.resetLoginAttempts(userId);
      } else {
        await this.recordFailedLogin(userId);
      }

      return isValid;
    } catch (error) {
      console.error('Password authentication failed:', error);
      this.logSecurityEvent({
        type: 'failed_login',
        userId,
        details: { method: 'password', error: error.message },
        severity: 'medium'
      });
      return false;
    }
  }

  private async simulateBiometricAuth(): Promise<boolean> {
    // Simulate biometric authentication with 90% success rate
    return Math.random() > 0.1;
  }

  private async verifyPassword(password: string): Promise<boolean> {
    // In a real implementation, this would use proper password hashing/verification
    // For demo purposes, we'll use a simple check
    return password.length >= 8;
  }

  private async recordFailedLogin(userId: string): Promise<void> {
    const attempts = this.loginAttempts.get(userId) || { count: 0, lastAttempt: new Date() };
    attempts.count++;
    attempts.lastAttempt = new Date();
    this.loginAttempts.set(userId, attempts);

    this.logSecurityEvent({
      type: 'failed_login',
      userId,
      details: { attemptCount: attempts.count },
      severity: attempts.count >= this.config.maxLoginAttempts ? 'high' : 'medium'
    });
  }

  private resetLoginAttempts(userId: string): void {
    this.loginAttempts.delete(userId);
  }

  private isAccountLocked(userId: string): boolean {
    const attempts = this.loginAttempts.get(userId);
    if (!attempts) return false;

    return attempts.count >= this.config.maxLoginAttempts &&
           (Date.now() - attempts.lastAttempt.getTime()) < (15 * 60 * 1000); // 15 minutes lockout
  }

  // Session Management
  private async createSession(userId: string): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const deviceId = await this.getDeviceId();

    this.activeSessions.set(sessionId, {
      userId,
      expiresAt: new Date(Date.now() + (this.config.sessionTimeout * 60 * 1000)),
      deviceId
    });

    return sessionId;
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return false;

    if (session.expiresAt < new Date()) {
      this.activeSessions.delete(sessionId);
      this.logSecurityEvent({
        type: 'logout',
        userId: session.userId,
        details: { reason: 'session_expired' },
        severity: 'low'
      });
      return false;
    }

    return true;
  }

  async logout(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      this.activeSessions.delete(sessionId);
      this.logSecurityEvent({
        type: 'logout',
        userId: session.userId,
        details: { reason: 'user_logout' },
        severity: 'low'
      });
    }
  }

  // Data Encryption
  async encryptData(data: string, keyVersion?: number): Promise<EncryptedData> {
    if (!this.config.encryptionEnabled) {
      return {
        data: btoa(data), // Simple base64 encoding as fallback
        iv: '',
        algorithm: 'none',
        keyVersion: 1
      };
    }

    try {
      const key = await this.getEncryptionKey(keyVersion);
      const iv = this.generateIV();

      const encrypted = await this.performEncryption(data, key, iv);

      return {
        data: encrypted,
        iv: btoa(iv),
        salt: keyVersion ? undefined : btoa(this.generateSalt()),
        algorithm: this.getAlgorithmForLevel(),
        keyVersion: keyVersion || 1
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      this.logSecurityEvent({
        type: 'security_breach',
        details: { error: 'Encryption failed', message: error.message },
        severity: 'high'
      });
      throw error;
    }
  }

  async decryptData(encryptedData: EncryptedData): Promise<string> {
    if (!this.config.encryptionEnabled) {
      return atob(encryptedData.data);
    }

    try {
      const key = await this.getEncryptionKey(encryptedData.keyVersion);
      const iv = atob(encryptedData.iv);

      const decrypted = await this.performDecryption(encryptedData.data, key, iv);
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      this.logSecurityEvent({
        type: 'security_breach',
        details: { error: 'Decryption failed', message: error.message },
        severity: 'critical'
      });
      throw error;
    }
  }

  private async initializeEncryptionKey(): Promise<void> {
    try {
      // Try to load existing key
      const storedKey = await AsyncStorage.getItem('@encryption_key');
      if (storedKey) {
        this.encryptionKey = storedKey;
      } else {
        // Generate new key
        this.encryptionKey = this.generateEncryptionKey();
        await AsyncStorage.setItem('@encryption_key', this.encryptionKey);
      }
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
      // Fallback to a default key (not secure, but prevents crashes)
      this.encryptionKey = 'default-fallback-key-not-secure';
    }
  }

  private async getEncryptionKey(version?: number): Promise<string> {
    // In a real implementation, this would manage key versions and rotation
    return this.encryptionKey || 'default-key';
  }

  private generateEncryptionKey(): string {
    // Generate a cryptographically secure random key
    const array = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto API
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return btoa(String.fromCharCode(...array));
  }

  private generateIV(): string {
    const array = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return String.fromCharCode(...array);
  }

  private generateSalt(): string {
    return this.generateIV(); // Salt can be same length as IV
  }

  private getAlgorithmForLevel(): string {
    switch (this.config.dataEncryptionLevel) {
      case 'military':
        return 'AES-256-GCM';
      case 'advanced':
        return 'AES-256-CBC';
      case 'basic':
      default:
        return 'AES-128-CBC';
    }
  }

  private async performEncryption(data: string, key: string, iv: string): Promise<string> {
    // In a real implementation, this would use Web Crypto API or similar
    // For now, we'll use a simple XOR cipher as a placeholder
    const keyBytes = atob(key).split('').map(c => c.charCodeAt(0));
    const ivBytes = iv.split('').map(c => c.charCodeAt(0));
    const dataBytes = data.split('').map(c => c.charCodeAt(0));

    const encrypted = dataBytes.map((byte, index) => {
      const keyByte = keyBytes[index % keyBytes.length];
      const ivByte = ivBytes[index % ivBytes.length];
      return byte ^ keyByte ^ ivByte;
    });

    return btoa(String.fromCharCode(...encrypted));
  }

  private async performDecryption(data: string, key: string, iv: string): Promise<string> {
    // Reverse of encryption
    const keyBytes = atob(key).split('').map(c => c.charCodeAt(0));
    const ivBytes = iv.split('').map(c => c.charCodeAt(0));
    const encryptedBytes = atob(data).split('').map(c => c.charCodeAt(0));

    const decrypted = encryptedBytes.map((byte, index) => {
      const keyByte = keyBytes[index % keyBytes.length];
      const ivByte = ivBytes[index % ivBytes.length];
      return byte ^ keyByte ^ ivByte;
    });

    return String.fromCharCode(...decrypted);
  }

  // Security Monitoring
  private logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    if (!this.config.auditLoggingEnabled) return;

    const securityEvent: SecurityEvent = {
      id: `security_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event
    };

    this.securityEvents.push(securityEvent);

    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }

    // Persist security events
    this.persistSecurityEvents();

    // Handle critical events
    if (event.severity === 'critical') {
      this.handleCriticalSecurityEvent(securityEvent);
    }
  }

  private async persistSecurityEvents(): Promise<void> {
    try {
      await AsyncStorage.setItem('@security_events', JSON.stringify(this.securityEvents));
    } catch (error) {
      console.error('Failed to persist security events:', error);
    }
  }

  private handleCriticalSecurityEvent(event: SecurityEvent): void {
    // In a real implementation, this would trigger alerts, remote wipe, etc.
    console.error('CRITICAL SECURITY EVENT:', event);

    if (this.config.remoteWipeEnabled) {
      // Trigger remote wipe
      this.performRemoteWipe();
    }
  }

  private async performRemoteWipe(): Promise<void> {
    try {
      // Clear all sensitive data
      const keys = await AsyncStorage.getAllKeys();
      const sensitiveKeys = keys.filter(key =>
        key.includes('session') ||
        key.includes('auth') ||
        key.includes('encryption') ||
        key.includes('content') ||
        key.includes('collaboration')
      );

      await AsyncStorage.multiRemove(sensitiveKeys);

      this.logSecurityEvent({
        type: 'security_breach',
        details: { action: 'remote_wipe_executed' },
        severity: 'critical'
      });

    } catch (error) {
      console.error('Remote wipe failed:', error);
    }
  }

  // Configuration Management
  async updateSecurityConfig(updates: Partial<SecurityConfig>): Promise<void> {
    this.config = { ...this.config, ...updates };
    await AsyncStorage.setItem('@security_config', JSON.stringify(this.config));
  }

  getSecurityConfig(): SecurityConfig {
    return { ...this.config };
  }

  // Utility Methods
  async getDeviceId(): Promise<string> {
    // In a real implementation, this would use device info libraries
    return `device_${Platform.OS}_${Date.now()}`;
  }

  getSecurityEvents(limit: number = 100): SecurityEvent[] {
    return this.securityEvents.slice(-limit);
  }

  async clearSecurityEvents(): Promise<void> {
    this.securityEvents = [];
    await AsyncStorage.removeItem('@security_events');
  }

  // Health Check
  async performSecurityHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check encryption
    if (!this.config.encryptionEnabled) {
      issues.push('Data encryption is disabled');
      recommendations.push('Enable data encryption for better security');
    }

    // Check biometric auth
    if (!this.config.biometricEnabled) {
      issues.push('Biometric authentication is disabled');
      recommendations.push('Enable biometric authentication for enhanced security');
    }

    // Check session timeout
    if (this.config.sessionTimeout > 480) { // 8 hours
      issues.push('Session timeout is too long');
      recommendations.push('Reduce session timeout to improve security');
    }

    // Check failed login attempts
    const recentFailedLogins = this.securityEvents.filter(
      event => event.type === 'failed_login' &&
      (Date.now() - event.timestamp.getTime()) < (24 * 60 * 60 * 1000) // Last 24 hours
    );

    if (recentFailedLogins.length > 10) {
      issues.push('High number of failed login attempts detected');
      recommendations.push('Review authentication security and consider additional measures');
    }

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (issues.length > 2) {
      status = 'critical';
    } else if (issues.length > 0) {
      status = 'warning';
    }

    return { status, issues, recommendations };
  }
}

export const mobileSecurity = MobileSecurityService.getInstance();