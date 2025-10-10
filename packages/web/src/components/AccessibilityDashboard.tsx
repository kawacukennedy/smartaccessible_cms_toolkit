'use client';

import React, { useRef, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useGestureSupport, useKeyboardGestures } from '../lib/gestureSupport';

const AccessibilityDashboard: React.FC = () => {
  const {
    // Existing
    highContrast, toggleHighContrast,
    fontSize, increaseFontSize, decreaseFontSize,
    colorBlindMode, setColorBlindMode,
    reducedMotion, toggleReducedMotion,

    // New features
    voiceNavigationEnabled, toggleVoiceNavigation, startVoiceNavigation, stopVoiceNavigation, speak,
    gestureSupportEnabled, toggleGestureSupport,
    screenReaderEnhanced, toggleScreenReaderEnhanced,
    announce
  } = useAccessibility();

  const dashboardRef = useRef<HTMLDivElement>(null);

  // Gesture support for the dashboard
  useGestureSupport(dashboardRef, {
    onSwipeLeft: () => announce('Swiped left'),
    onSwipeRight: () => announce('Swiped right'),
    onSwipeUp: () => announce('Swiped up'),
    onSwipeDown: () => announce('Swiped down'),
    onPinchIn: (scale) => announce(`Pinched in with scale ${scale.toFixed(2)}`),
    onPinchOut: (scale) => announce(`Pinched out with scale ${scale.toFixed(2)}`),
    onTap: (x, y) => announce(`Tapped at ${x}, ${y}`),
    onDoubleTap: (x, y) => announce(`Double tapped at ${x}, ${y}`),
    onLongPress: (x, y) => announce(`Long pressed at ${x}, ${y}`)
  }, { enableSwipe: gestureSupportEnabled, enablePinch: gestureSupportEnabled });

  // Keyboard navigation
  useKeyboardGestures({
    onArrowUp: () => announce('Arrow up pressed'),
    onArrowDown: () => announce('Arrow down pressed'),
    onArrowLeft: () => announce('Arrow left pressed'),
    onArrowRight: () => announce('Arrow right pressed'),
    onEnter: () => announce('Enter pressed'),
    onEscape: () => announce('Escape pressed'),
    onTab: () => announce('Tab pressed'),
    onShiftTab: () => announce('Shift tab pressed')
  });

  // Voice navigation demo
  const handleVoiceDemo = () => {
    if (voiceNavigationEnabled) {
      speak('Voice navigation is now active. Try saying commands like "go to dashboard" or "scroll down".');
      startVoiceNavigation();
    }
  };

  const handleStopVoiceDemo = () => {
    stopVoiceNavigation();
    speak('Voice navigation stopped.');
  };

  return (
    <div
      ref={dashboardRef}
      className="accessibility-dashboard p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      role="region"
      aria-labelledby="accessibility-title"
    >
      <h2 id="accessibility-title" className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Advanced Accessibility Settings
      </h2>

      {/* Existing Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Visual Settings</h3>

          <div className="flex items-center justify-between">
            <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              High Contrast Mode
            </label>
            <button
              id="high-contrast"
              onClick={toggleHighContrast}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                highContrast ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
              aria-pressed={highContrast}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="reduced-motion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reduced Motion
            </label>
            <button
              id="reduced-motion"
              onClick={toggleReducedMotion}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                reducedMotion ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
              aria-pressed={reducedMotion}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={decreaseFontSize}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{fontSize}</span>
              <button
                onClick={increaseFontSize}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="color-blind-mode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Color Blind Mode
            </label>
            <select
              id="color-blind-mode"
              value={colorBlindMode}
              onChange={(e) => setColorBlindMode(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="none">None</option>
              <option value="protanopia">Protanopia (Red-blind)</option>
              <option value="deuteranopia">Deuteranopia (Green-blind)</option>
              <option value="tritanopia">Tritanopia (Blue-blind)</option>
              <option value="achromatopsia">Achromatopsia (Total color blindness)</option>
            </select>
          </div>
        </div>

        {/* New Advanced Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Advanced Features</h3>

          <div className="flex items-center justify-between">
            <label htmlFor="voice-navigation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Voice Navigation
            </label>
            <button
              id="voice-navigation"
              onClick={toggleVoiceNavigation}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                voiceNavigationEnabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
              aria-pressed={voiceNavigationEnabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  voiceNavigationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {voiceNavigationEnabled && (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={handleVoiceDemo}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Start Voice Demo
                </button>
                <button
                  onClick={handleStopVoiceDemo}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Stop Voice
                </button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Try saying: "go to dashboard", "scroll down", "toggle menu"
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label htmlFor="gesture-support" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gesture Support
            </label>
            <button
              id="gesture-support"
              onClick={toggleGestureSupport}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                gestureSupportEnabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
              aria-pressed={gestureSupportEnabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  gestureSupportEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="screen-reader-enhanced" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Screen Reader Enhanced
            </label>
            <button
              id="screen-reader-enhanced"
              onClick={toggleScreenReaderEnhanced}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                screenReaderEnhanced ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
              aria-pressed={screenReaderEnhanced}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  screenReaderEnhanced ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">How to Use</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• <strong>Voice Navigation:</strong> Enable and try voice commands like "go to dashboard" or "scroll down"</li>
          <li>• <strong>Gesture Support:</strong> Try swiping, pinching, or tapping on touch devices</li>
          <li>• <strong>Keyboard Navigation:</strong> Use arrow keys, Tab, and Enter for navigation</li>
          <li>• <strong>Screen Reader:</strong> All actions are announced to screen readers</li>
        </ul>
      </div>
    </div>
  );
};

export default AccessibilityDashboard;