import AsyncStorage from '@react-native-async-storage/async-storage';

let telemetryEnabled: boolean | null = null;

const loadTelemetryConsent = async () => {
  try {
    const consent = await AsyncStorage.getItem('telemetryConsent');
    if (consent !== null) {
      telemetryEnabled = JSON.parse(consent);
    }
  } catch (e) {
    console.error('Failed to load telemetry consent for tracking', e);
  }
};

// Load consent immediately when the module is imported
loadTelemetryConsent();

export const trackEvent = async (eventName: string, properties?: { [key: string]: any }) => {
  // Ensure consent is loaded before tracking
  if (telemetryEnabled === null) {
    await loadTelemetryConsent();
  }

  if (telemetryEnabled) {
    console.log(`Tracking event: ${eventName}`, properties);
    // In a real application, you would send this data to an analytics service
    // e.g., Firebase Analytics, Amplitude, custom backend
  } else {
    console.log(`Telemetry disabled. Event not tracked: ${eventName}`);
  }
};

// Function to update telemetry status from outside (e.g., from settings or consent modal)
export const setTelemetryEnabled = (enabled: boolean) => {
  telemetryEnabled = enabled;
};
