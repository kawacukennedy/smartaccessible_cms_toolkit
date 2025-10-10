import { MobileMediaProcessor, MediaFile } from './mobileMediaProcessor';
import { MobileGestureSupport, GestureEvent, VoiceCommand } from './mobileGestureSupport';
import { MobileDeploymentUtils, DeploymentConfig } from './mobileDeploymentUtils';
import { mobileCollaboration, CollaborationSession, Collaborator } from './mobileCollaboration';
import { mobileSecurity, SecurityConfig, SecurityEvent } from './mobileSecurity';
import { mobileCloudSync, SyncConfig, SyncSession } from './mobileCloudSync';
import { mobileSearch, SearchQuery, SearchResult } from './mobileSearch';

export interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export class MobileIntegrationTests {
  private results: TestResult[] = [];
  private gestureSupport: MobileGestureSupport;

  constructor() {
    this.gestureSupport = new MobileGestureSupport();
  }

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting Mobile Integration Tests...');

    this.results = [];

    // Media Processing Tests
    await this.testMediaProcessing();

    // Gesture Support Tests
    await this.testGestureSupport();

    // Voice Navigation Tests
    await this.testVoiceNavigation();

    // Deployment Utils Tests
    await this.testDeploymentUtils();

    // Cross-Component Integration Tests
    await this.testCrossComponentIntegration();

    // Advanced Features Tests
    await this.testCollaborationFeatures();
    await this.testSecurityFeatures();
    await this.testCloudSyncFeatures();
    await this.testSearchFeatures();

    console.log('✅ Mobile Integration Tests Complete');
    return this.results;
  }

  private async testMediaProcessing(): Promise<void> {
    console.log('📸 Testing Media Processing...');

    // Test file validation
    await this.runTest('Media File Validation', async () => {
      const validFile: MediaFile = {
        id: 'test1',
        uri: 'test.jpg',
        type: 'image',
        size: 1024 * 1024, // 1MB
        name: 'test.jpg'
      };

      const invalidFile: MediaFile = {
        id: 'test2',
        uri: 'test.exe',
        type: 'document' as any,
        size: 100 * 1024 * 1024, // 100MB
        name: 'test.exe'
      };

      const validResult = MobileMediaProcessor.validateFile(validFile);
      const invalidResult = MobileMediaProcessor.validateFile(invalidFile);

      if (!validResult.valid || invalidResult.valid) {
        throw new Error('File validation logic incorrect');
      }
    });

    // Test OCR processing
    await this.runTest('OCR Processing', async () => {
      const ocrText = await MobileMediaProcessor.processOCR('test-image.jpg');
      if (!ocrText || typeof ocrText !== 'string') {
        throw new Error('OCR processing failed');
      }
    });

    // Test smart tagging
    await this.runTest('Smart Tagging', async () => {
      const testFile: MediaFile = {
        id: 'test',
        uri: 'test.jpg',
        type: 'image',
        size: 1024,
        name: 'logo.jpg'
      };

      const tags = await MobileMediaProcessor.generateSmartTags(testFile);
      if (!Array.isArray(tags) || tags.length === 0) {
        throw new Error('Smart tagging failed');
      }
    });

    // Test batch processing
    await this.runTest('Batch Processing', async () => {
      const testFiles: MediaFile[] = [
        { id: '1', uri: 'img1.jpg', type: 'image', size: 1024, name: 'img1.jpg' },
        { id: '2', uri: 'img2.png', type: 'image', size: 2048, name: 'img2.png' },
      ];

      const result = await MobileMediaProcessor.processBatch(testFiles);
      if (result.processed.length !== 2) {
        throw new Error('Batch processing failed');
      }
    });
  }

  private async testGestureSupport(): Promise<void> {
    console.log('👆 Testing Gesture Support...');

    // Test gesture event emission
    await this.runTest('Gesture Event Handling', async () => {
      let gestureReceived = false;

      const listener = (event: GestureEvent) => {
        gestureReceived = true;
      };

      this.gestureSupport.addGestureListener(listener);

      // Simulate tap gesture
      this.gestureSupport.onTapGesture({ x: 100, y: 100 });

      // Wait for async processing
      await new Promise(resolve => setTimeout(resolve, 100));

      this.gestureSupport.removeGestureListener(listener);

      if (!gestureReceived) {
        throw new Error('Gesture event not received');
      }
    });

    // Test swipe gesture
    await this.runTest('Swipe Gesture Detection', async () => {
      let swipeDetected = false;

      const listener = (event: GestureEvent) => {
        if (event.type === 'swipe') {
          swipeDetected = true;
        }
      };

      this.gestureSupport.addGestureListener(listener);

      // Simulate swipe gesture (pan end event)
      this.gestureSupport.onPanGesture(
        { nativeEvent: { translationX: 100, translationY: 0, velocityX: 500, velocityY: 0 } },
        { state: 5 } // State.END
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      this.gestureSupport.removeGestureListener(listener);

      if (!swipeDetected) {
        throw new Error('Swipe gesture not detected');
      }
    });
  }

  private async testVoiceNavigation(): Promise<void> {
    console.log('🎤 Testing Voice Navigation...');

    // Test voice command processing
    await this.runTest('Voice Command Processing', async () => {
      let commandReceived = false;

      const listener = (command: VoiceCommand) => {
        commandReceived = true;
      };

      this.gestureSupport.addVoiceListener(listener);

      const command = this.gestureSupport.processVoiceCommand('go back', 0.9);

      this.gestureSupport.removeVoiceListener(listener);

      if (!commandReceived || command.action !== 'navigate_back') {
        throw new Error('Voice command processing failed');
      }
    });

    // Test multiple voice commands
    await this.runTest('Voice Command Recognition', async () => {
      const testCommands = [
        { input: 'open settings', expected: 'open_settings' },
        { input: 'show menu', expected: 'show_menu' },
        { input: 'next item', expected: 'next_item' },
        { input: 'save changes', expected: 'save_changes' },
      ];

      for (const test of testCommands) {
        const command = this.gestureSupport.processVoiceCommand(test.input, 0.8);
        if (command.action !== test.expected) {
          throw new Error(`Voice command "${test.input}" not recognized correctly`);
        }
      }
    });
  }

  private async testDeploymentUtils(): Promise<void> {
    console.log('🚀 Testing Deployment Utils...');

    // Test configuration management
    await this.runTest('Deployment Config Management', async () => {
      const testConfig: Partial<DeploymentConfig> = {
        appVersion: '2.0.0',
        environment: 'staging',
        autoUpdate: false,
      };

      await MobileDeploymentUtils.updateDeploymentConfig(testConfig);
      const retrievedConfig = await MobileDeploymentUtils.getDeploymentConfig();

      if (retrievedConfig.appVersion !== '2.0.0' ||
          retrievedConfig.environment !== 'staging' ||
          retrievedConfig.autoUpdate !== false) {
        throw new Error('Configuration management failed');
      }

      // Reset to defaults
      await MobileDeploymentUtils.updateDeploymentConfig({
        appVersion: '1.0.0',
        environment: 'development',
        autoUpdate: true,
      });
    });

    // Test metrics tracking
    await this.runTest('Metrics Tracking', async () => {
      const initialMetrics = await MobileDeploymentUtils.getDeploymentMetrics();
      const initialStarts = initialMetrics.appStarts;

      await MobileDeploymentUtils.incrementMetric('appStarts');

      const updatedMetrics = await MobileDeploymentUtils.getDeploymentMetrics();

      if (updatedMetrics.appStarts !== initialStarts + 1) {
        throw new Error('Metrics tracking failed');
      }
    });

    // Test update checking
    await this.runTest('Update Checking', async () => {
      const update = await MobileDeploymentUtils.checkForUpdates();

      // Update might be null (no update available) or an UpdateInfo object
      if (update !== null && typeof update !== 'object') {
        throw new Error('Update check returned invalid result');
      }
    });
  }

  private async testCrossComponentIntegration(): Promise<void> {
    console.log('🔗 Testing Cross-Component Integration...');

    // Test gesture and voice integration
    await this.runTest('Gesture-Voice Integration', async () => {
      let gestureAndVoiceWorked = false;

      const gestureListener = (event: GestureEvent) => {
        if (event.type === 'tap') {
          // Simulate voice command after gesture
          setTimeout(() => {
            this.gestureSupport.processVoiceCommand('go home', 0.9);
          }, 50);
        }
      };

      const voiceListener = (command: VoiceCommand) => {
        if (command.action === 'navigate_home') {
          gestureAndVoiceWorked = true;
        }
      };

      this.gestureSupport.addGestureListener(gestureListener);
      this.gestureSupport.addVoiceListener(voiceListener);

      // Trigger gesture
      this.gestureSupport.onTapGesture({ x: 50, y: 50 });

      // Wait for async processing
      await new Promise(resolve => setTimeout(resolve, 200));

      this.gestureSupport.removeGestureListener(gestureListener);
      this.gestureSupport.removeVoiceListener(voiceListener);

      if (!gestureAndVoiceWorked) {
        throw new Error('Gesture-voice integration failed');
      }
    });

    // Test media processing with deployment tracking
    await this.runTest('Media-Deployment Integration', async () => {
      const testFile: MediaFile = {
        id: 'integration-test',
        uri: 'test.jpg',
        type: 'image',
        size: 1024,
        name: 'integration.jpg'
      };

      // Process media file
      const processedFile = await MobileMediaProcessor.processSingleFile(testFile);

      // Track the processing event
      await MobileDeploymentUtils.trackEvent('media_processed', {
        fileId: processedFile.id,
        hasTags: !!processedFile.metadata?.tags,
        hasAltText: !!processedFile.metadata?.altText,
      });

      if (!processedFile.metadata?.tags || !processedFile.metadata?.altText) {
        throw new Error('Media processing integration failed');
      }
    });
  }

  private async testCollaborationFeatures(): Promise<void> {
    console.log('👥 Testing Collaboration Features...');

    // Test session creation
    await this.runTest('Collaboration Session Creation', async () => {
      const session = await mobileCollaboration.createSession('test-doc-123', 'user1', 'Test User');
      if (!session.id || session.participants.length !== 1) {
        throw new Error('Session creation failed');
      }
    });

    // Test joining session
    await this.runTest('Collaboration Session Joining', async () => {
      const session = await mobileCollaboration.createSession('test-doc-456', 'user1', 'Test User');
      const joinedSession = await mobileCollaboration.joinSession(session.id, 'user2', 'User Two');

      if (joinedSession.participants.length !== 2) {
        throw new Error('Session joining failed');
      }
    });

    // Test cursor tracking
    await this.runTest('Cursor Position Tracking', async () => {
      const session = await mobileCollaboration.createSession('test-doc-789', 'user1', 'Test User');
      await mobileCollaboration.updateCursorPosition(session.id, 'user1', { x: 100, y: 200, line: 5 });

      const cursors = mobileCollaboration.getCursorPositions(session.id);
      if (cursors.length !== 1 || cursors[0].x !== 100) {
        throw new Error('Cursor tracking failed');
      }
    });

    // Test real-time messaging
    await this.runTest('Real-time Messaging', async () => {
      const session = await mobileCollaboration.createSession('test-doc-msg', 'user1', 'Test User');
      await mobileCollaboration.sendMessage(session.id, 'user1', 'Hello World!');

      const messages = mobileCollaboration.getMessages(session.id);
      if (messages.length !== 1 || messages[0].content !== 'Hello World!') {
        throw new Error('Real-time messaging failed');
      }
    });
  }

  private async testSecurityFeatures(): Promise<void> {
    console.log('🔒 Testing Security Features...');

    // Test security configuration
    await this.runTest('Security Configuration', async () => {
      const config = await mobileSecurity.getSecurityConfig();
      if (!config.encryptionEnabled || !config.auditLogging) {
        throw new Error('Security configuration not properly initialized');
      }
    });

    // Test encryption/decryption
    await this.runTest('Data Encryption', async () => {
      const testData = 'sensitive information';
      const encrypted = await mobileSecurity.encryptData(testData);
      const decrypted = await mobileSecurity.decryptData(encrypted);

      if (decrypted !== testData) {
        throw new Error('Encryption/decryption failed');
      }
    });

    // Test security health check
    await this.runTest('Security Health Check', async () => {
      const health = await mobileSecurity.performSecurityHealthCheck();
      if (!health.status || health.status === 'critical') {
        throw new Error('Security health check failed');
      }
    });

    // Test audit logging
    await this.runTest('Audit Logging', async () => {
      await mobileSecurity.logSecurityEvent('test_event', 'Test security event', 'info');
      const events = await mobileSecurity.getSecurityEvents(10);

      const testEvent = events.find(e => e.event === 'test_event');
      if (!testEvent) {
        throw new Error('Audit logging failed');
      }
    });
  }

  private async testCloudSyncFeatures(): Promise<void> {
    console.log('☁️ Testing Cloud Sync Features...');

    // Test sync configuration
    await this.runTest('Sync Configuration', async () => {
      const config = await mobileCloudSync.getSyncConfig();
      if (!config.autoSync || !config.conflictResolution) {
        throw new Error('Sync configuration not properly initialized');
      }
    });

    // Test sync session creation
    await this.runTest('Sync Session Management', async () => {
      const session = await mobileCloudSync.startSyncSession();
      if (!session.id || session.status !== 'active') {
        throw new Error('Sync session creation failed');
      }

      await mobileCloudSync.endSyncSession(session.id);
      const endedSession = await mobileCloudSync.getSyncSession(session.id);
      if (endedSession.status !== 'completed') {
        throw new Error('Sync session ending failed');
      }
    });

    // Test conflict resolution
    await this.runTest('Conflict Resolution', async () => {
      const conflictData = {
        itemId: 'test-item',
        localVersion: 'Local content',
        remoteVersion: 'Remote content',
        timestamp: Date.now()
      };

      const resolution = await mobileCloudSync.resolveConflict(conflictData.itemId, 'local');
      if (!resolution.resolved) {
        throw new Error('Conflict resolution failed');
      }
    });

    // Test sync queue management
    await this.runTest('Sync Queue Management', async () => {
      const queueLength = mobileCloudSync.getSyncQueueLength();
      const initialLength = queueLength;

      await mobileCloudSync.addToSyncQueue({
        id: 'test-item',
        type: 'content',
        action: 'create',
        data: { content: 'Test content' }
      });

      const newLength = mobileCloudSync.getSyncQueueLength();
      if (newLength !== initialLength + 1) {
        throw new Error('Sync queue management failed');
      }
    });
  }

  private async testSearchFeatures(): Promise<void> {
    console.log('🔍 Testing Search Features...');

    // Test basic search
    await this.runTest('Basic Search Functionality', async () => {
      const query: SearchQuery = {
        text: 'test content',
        options: {
          fuzzy: false,
          semantic: false,
          caseSensitive: false,
          wholeWords: false,
        }
      };

      const results = await mobileSearch.performSearch(query);
      // Results might be empty for test data, but should not throw error
      if (!Array.isArray(results)) {
        throw new Error('Search returned invalid results');
      }
    });

    // Test fuzzy search
    await this.runTest('Fuzzy Search', async () => {
      const query: SearchQuery = {
        text: 'contnt', // Intentional typo
        options: {
          fuzzy: true,
          semantic: false,
          caseSensitive: false,
          wholeWords: false,
        }
      };

      const results = await mobileSearch.performSearch(query);
      if (!Array.isArray(results)) {
        throw new Error('Fuzzy search failed');
      }
    });

    // Test semantic search
    await this.runTest('Semantic Search', async () => {
      const query: SearchQuery = {
        text: 'information about technology',
        options: {
          fuzzy: false,
          semantic: true,
          caseSensitive: false,
          wholeWords: false,
        }
      };

      const results = await mobileSearch.performSearch(query);
      if (!Array.isArray(results)) {
        throw new Error('Semantic search failed');
      }
    });

    // Test search analytics
    await this.runTest('Search Analytics', async () => {
      const analytics = await mobileSearch.getSearchAnalytics();
      if (typeof analytics.totalSearches !== 'number') {
        throw new Error('Search analytics failed');
      }
    });
  }

  private async runTest(testName: string, testFunction: () => Promise<void>): Promise<void> {
    const startTime = Date.now();

    try {
      await testFunction();
      const duration = Date.now() - startTime;
      this.results.push({
        testName,
        passed: true,
        duration,
      });
      console.log(`✅ ${testName} - PASSED (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.results.push({
        testName,
        passed: false,
        error: errorMessage,
        duration,
      });
      console.log(`❌ ${testName} - FAILED (${duration}ms): ${errorMessage}`);
    }
  }

  getTestSummary(): { total: number; passed: number; failed: number; duration: number } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const duration = this.results.reduce((sum, r) => sum + r.duration, 0);

    return { total, passed, failed, duration };
  }

  getFailedTests(): TestResult[] {
    return this.results.filter(r => !r.passed);
  }

  printSummary(): void {
    const summary = this.getTestSummary();

    console.log('\n📊 Test Summary:');
    console.log(`Total Tests: ${summary.total}`);
    console.log(`Passed: ${summary.passed}`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Total Duration: ${summary.duration}ms`);

    if (summary.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.getFailedTests().forEach(test => {
        console.log(`- ${test.testName}: ${test.error}`);
      });
    }

    const successRate = ((summary.passed / summary.total) * 100).toFixed(1);
    console.log(`\n🎯 Success Rate: ${successRate}%`);
  }
}

// Export a function to run tests easily
export const runMobileIntegrationTests = async (): Promise<{
  results: TestResult[];
  summary: { total: number; passed: number; failed: number; duration: number };
  failedTests: TestResult[];
}> => {
  const tester = new MobileIntegrationTests();
  const results = await tester.runAllTests();
  const summary = tester.getTestSummary();
  const failedTests = tester.getFailedTests();

  tester.printSummary();

  return { results, summary, failedTests };
};