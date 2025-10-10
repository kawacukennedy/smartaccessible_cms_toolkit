import { trackEvent } from '../telemetry'

// Mock console.log
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

describe('Telemetry', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('trackEvent', () => {
    it('should log event when telemetry is enabled', () => {
      // Import and initialize telemetry
      const { initializeTelemetry } = require('../telemetry')
      initializeTelemetry()

      trackEvent('test_event', { key: 'value' })

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Web Telemetry: Tracking event: test_event with properties: {"key":"value"}'
      )
    })

    it('should log event without properties', () => {
      const { initializeTelemetry } = require('../telemetry')
      initializeTelemetry()

      trackEvent('simple_event')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Web Telemetry: Tracking event: simple_event'
      )
    })

    it('should not log when telemetry is disabled', () => {
      // Reset telemetry state
      jest.resetModules()
      const { trackEvent: trackEventDisabled } = require('../telemetry')

      trackEventDisabled('disabled_event')

      expect(consoleLogSpy).not.toHaveBeenCalled()
    })
  })
})