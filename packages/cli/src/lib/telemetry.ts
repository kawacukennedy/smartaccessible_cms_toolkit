import { log } from './logger';
import inquirer from 'inquirer';

let telemetryEnabled: boolean | null = null;

export const initializeTelemetry = async () => {
  // In a real application, this would involve checking a config file or user preferences
  // For now, we'll simulate asking for consent once.
  if (telemetryEnabled === null) {
    const { consent } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'consent',
        message: 'Do you agree to send anonymous usage data to help improve the CLI? (Privacy Policy: [link to policy])',
        default: false,
      },
    ]);
    telemetryEnabled = consent;
    if (telemetryEnabled) {
      log('Anonymous telemetry enabled. Thank you!');
    } else {
      log('Anonymous telemetry disabled.');
    }
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (telemetryEnabled) {
    log(`Tracking event: ${eventName}` + (properties ? ` with properties: ${JSON.stringify(properties)}` : ''));
    // In a real application, this would send data to a telemetry service
  } else {
    // log(`Telemetry disabled, not tracking event: ${eventName}`);
  }
};
