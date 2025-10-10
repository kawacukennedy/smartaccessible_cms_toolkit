import { useEffect, useCallback } from 'react';

// Screen reader announcement utilities
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';

  document.body.appendChild(announcement);
  announcement.textContent = message;

  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
};

// Focus management utilities
export const manageFocus = {
  // Move focus to a specific element
  moveTo: (element: HTMLElement | null) => {
    if (element) {
      element.focus();
      announceToScreenReader(`Focused on ${element.getAttribute('aria-label') || element.textContent || 'element'}`);
    }
  },

  // Move focus to next focusable element
  moveToNext: () => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element);

    if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
      const nextElement = focusableElements[currentIndex + 1] as HTMLElement;
      manageFocus.moveTo(nextElement);
    }
  },

  // Move focus to previous focusable element
  moveToPrevious: () => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element);

    if (currentIndex > 0) {
      const prevElement = focusableElements[currentIndex - 1] as HTMLElement;
      manageFocus.moveTo(prevElement);
    }
  },

  // Trap focus within a container
  trap: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
};

// Skip link functionality
export const createSkipLinks = () => {
  const skipLinks = [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#search', text: 'Skip to search' }
  ];

  const skipLinksContainer = document.createElement('div');
  skipLinksContainer.className = 'skip-links';
  skipLinksContainer.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    z-index: 1000;
    transition: top 0.3s;
  `;

  skipLinks.forEach(link => {
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.textContent = link.text;
    anchor.style.cssText = `
      display: inline-block;
      padding: 8px;
      background: #000;
      color: #fff;
      text-decoration: none;
      margin-right: 8px;
      border-radius: 4px;
    `;

    anchor.addEventListener('focus', () => {
      skipLinksContainer.style.top = '6px';
    });

    anchor.addEventListener('blur', () => {
      skipLinksContainer.style.top = '-40px';
    });

    skipLinksContainer.appendChild(anchor);
  });

  document.body.insertBefore(skipLinksContainer, document.body.firstChild);
};

// Enhanced ARIA utilities
export const ariaUtils = {
  // Set ARIA live region for dynamic content
  createLiveRegion: (priority: 'polite' | 'assertive' = 'polite') => {
    const region = document.createElement('div');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    return region;
  },

  // Update ARIA attributes dynamically
  updateAria: (element: HTMLElement, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(`aria-${key}`, value);
    });
  },

  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string = 'aria') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Screen reader detection
export const useScreenReaderDetection = () => {
  const checkScreenReader = useCallback(() => {
    // Check for common screen reader indicators
    const hasScreenReader =
      // NVDA
      'speechSynthesis' in window &&
      // JAWS
      document.querySelector('[role="application"]') !== null &&
      // VoiceOver (basic check)
      navigator.platform.includes('Mac') &&
      'speechSynthesis' in window;

    return hasScreenReader;
  }, []);

  useEffect(() => {
    const screenReaderDetected = checkScreenReader();
    if (screenReaderDetected) {
      document.documentElement.setAttribute('data-screen-reader', 'true');
      announceToScreenReader('Screen reader detected. Enhanced accessibility features enabled.');
    }
  }, [checkScreenReader]);
};

// High contrast mode detection
export const useHighContrastDetection = () => {
  const checkHighContrast = useCallback(() => {
    // Create test elements to detect high contrast mode
    const testElement = document.createElement('div');
    testElement.style.cssText = `
      position: absolute;
      left: -9999px;
      background: rgb(31, 41, 55);
      color: rgb(255, 255, 255);
    `;
    testElement.textContent = 'test';

    document.body.appendChild(testElement);

    const computedStyle = window.getComputedStyle(testElement);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;

    document.body.removeChild(testElement);

    // If colors are the same, high contrast mode might be active
    return backgroundColor === color;
  }, []);

  useEffect(() => {
    const isHighContrast = checkHighContrast();
    if (isHighContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    }
  }, [checkHighContrast]);
};