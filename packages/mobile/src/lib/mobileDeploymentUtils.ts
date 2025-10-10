import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DeploymentConfig {
  appVersion: string;
  buildNumber: string;
  environment: 'development' | 'staging' | 'production';
  updateChannel: string;
  autoUpdate: boolean;
  crashReporting: boolean;
  analyticsEnabled: boolean;
  remoteConfigUrl?: string;
}

export interface DeploymentMetrics {
  appStarts: number;
  crashCount: number;
  updateChecks: number;
  successfulUpdates: number;
  failedUpdates: number;
  lastUpdateCheck: Date;
  lastSuccessfulUpdate: Date;
}

export interface UpdateInfo {
  version: string;
  buildNumber: string;
  releaseNotes: string;
  downloadUrl: string;
  mandatory: boolean;
  size: number;
}

export class MobileDeploymentUtils {
  private static readonly CONFIG_KEY = '@deployment_config';
  private static readonly METRICS_KEY = '@deployment_metrics';

  // Configuration Management
  static async getDeploymentConfig(): Promise<DeploymentConfig> {
    try {
      const configJson = await AsyncStorage.getItem(this.CONFIG_KEY);
      if (configJson) {
        return JSON.parse(configJson);
      }
    } catch (error) {
      console.error('Error loading deployment config:', error);
    }

    // Return default config
    return {
      appVersion: '1.0.0',
      buildNumber: '1',
      environment: 'development',
      updateChannel: 'stable',
      autoUpdate: true,
      crashReporting: true,
      analyticsEnabled: true,
    };
  }

  static async saveDeploymentConfig(config: DeploymentConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving deployment config:', error);
      throw error;
    }
  }

  static async updateDeploymentConfig(updates: Partial<DeploymentConfig>): Promise<void> {
    const currentConfig = await this.getDeploymentConfig();
    const newConfig = { ...currentConfig, ...updates };
    await this.saveDeploymentConfig(newConfig);
  }

  // Metrics Tracking
  static async getDeploymentMetrics(): Promise<DeploymentMetrics> {
    try {
      const metricsJson = await AsyncStorage.getItem(this.METRICS_KEY);
      if (metricsJson) {
        const metrics = JSON.parse(metricsJson);
        // Convert date strings back to Date objects
        return {
          ...metrics,
          lastUpdateCheck: new Date(metrics.lastUpdateCheck),
          lastSuccessfulUpdate: new Date(metrics.lastSuccessfulUpdate),
        };
      }
    } catch (error) {
      console.error('Error loading deployment metrics:', error);
    }

    // Return default metrics
    const now = new Date();
    return {
      appStarts: 0,
      crashCount: 0,
      updateChecks: 0,
      successfulUpdates: 0,
      failedUpdates: 0,
      lastUpdateCheck: now,
      lastSuccessfulUpdate: now,
    };
  }

  static async updateDeploymentMetrics(updates: Partial<DeploymentMetrics>): Promise<void> {
    const currentMetrics = await this.getDeploymentMetrics();
    const newMetrics = { ...currentMetrics, ...updates };
    try {
      await AsyncStorage.setItem(this.METRICS_KEY, JSON.stringify(newMetrics));
    } catch (error) {
      console.error('Error saving deployment metrics:', error);
      throw error;
    }
  }

  static async incrementMetric(metric: keyof DeploymentMetrics): Promise<void> {
    const currentMetrics = await this.getDeploymentMetrics();
    if (typeof currentMetrics[metric] === 'number') {
      await this.updateDeploymentMetrics({
        [metric]: (currentMetrics[metric] as number) + 1,
      });
    }
  }

  // Update Management
  static async checkForUpdates(): Promise<UpdateInfo | null> {
    const config = await this.getDeploymentConfig();

    if (!config.remoteConfigUrl) {
      console.log('No remote config URL configured');
      return null;
    }

    try {
      await this.incrementMetric('updateChecks');
      await this.updateDeploymentMetrics({ lastUpdateCheck: new Date() });

      // Simulate API call to check for updates
      const response = await this.simulateUpdateCheck(config);

      if (response && this.isNewerVersion(response.version, config.appVersion)) {
        return response;
      }

      return null;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return null;
    }
  }

  private static async simulateUpdateCheck(config: DeploymentConfig): Promise<UpdateInfo | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate update availability (20% chance)
    if (Math.random() < 0.2) {
      const currentVersion = config.appVersion.split('.').map(Number);
      const newVersion = [...currentVersion];
      newVersion[2] += 1; // Increment patch version

      return {
        version: newVersion.join('.'),
        buildNumber: (parseInt(config.buildNumber) + 1).toString(),
        releaseNotes: 'Bug fixes and performance improvements',
        downloadUrl: 'https://example.com/app-update.apk',
        mandatory: Math.random() < 0.1, // 10% chance of mandatory update
        size: Math.floor(Math.random() * 50000000) + 10000000, // 10-60MB
      };
    }

    return null;
  }

  private static isNewerVersion(newVersion: string, currentVersion: string): boolean {
    const newParts = newVersion.split('.').map(Number);
    const currentParts = currentVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
      const newPart = newParts[i] || 0;
      const currentPart = currentParts[i] || 0;

      if (newPart > currentPart) return true;
      if (newPart < currentPart) return false;
    }

    return false;
  }

  static async downloadAndInstallUpdate(updateInfo: UpdateInfo): Promise<boolean> {
    try {
      // Simulate download progress
      console.log(`Downloading update ${updateInfo.version}...`);

      // Simulate download time based on size
      const downloadTime = Math.max(1000, updateInfo.size / 1000000); // 1ms per MB, min 1s
      await new Promise(resolve => setTimeout(resolve, downloadTime));

      console.log('Update downloaded, installing...');

      // Simulate installation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update config with new version
      await this.updateDeploymentConfig({
        appVersion: updateInfo.version,
        buildNumber: updateInfo.buildNumber,
      });

      await this.incrementMetric('successfulUpdates');
      await this.updateDeploymentMetrics({ lastSuccessfulUpdate: new Date() });

      return true;
    } catch (error) {
      console.error('Error installing update:', error);
      await this.incrementMetric('failedUpdates');
      return false;
    }
  }

  // Crash Reporting
  static async reportCrash(error: Error, context?: any): Promise<void> {
    const config = await this.getDeploymentConfig();

    if (!config.crashReporting) {
      console.log('Crash reporting disabled');
      return;
    }

    try {
      await this.incrementMetric('crashCount');

      const crashReport = {
        error: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        appVersion: config.appVersion,
        buildNumber: config.buildNumber,
        environment: config.environment,
      };

      // In a real implementation, this would send to a crash reporting service
      console.log('Crash reported:', crashReport);

      // Store locally for debugging (in production, this would be sent to a service)
      const crashKey = `@crash_${Date.now()}`;
      await AsyncStorage.setItem(crashKey, JSON.stringify(crashReport));

    } catch (reportError) {
      console.error('Error reporting crash:', reportError);
    }
  }

  // Analytics
  static async trackEvent(eventName: string, parameters?: any): Promise<void> {
    const config = await this.getDeploymentConfig();

    if (!config.analyticsEnabled) {
      return;
    }

    try {
      const event = {
        name: eventName,
        parameters,
        timestamp: new Date().toISOString(),
        appVersion: config.appVersion,
        environment: config.environment,
      };

      // In a real implementation, this would send to analytics service
      console.log('Analytics event:', event);

    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Utility Methods
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CONFIG_KEY);
      await AsyncStorage.removeItem(this.METRICS_KEY);

      // Clear crash reports
      const keys = await AsyncStorage.getAllKeys();
      const crashKeys = keys.filter(key => key.startsWith('@crash_'));
      await AsyncStorage.multiRemove(crashKeys);

    } catch (error) {
      console.error('Error clearing deployment data:', error);
      throw error;
    }
  }

  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  static getEnvironmentColor(environment: string): string {
    switch (environment) {
      case 'production': return '#28a745';
      case 'staging': return '#ffc107';
      case 'development': return '#dc3545';
      default: return '#6c757d';
    }
  }
}