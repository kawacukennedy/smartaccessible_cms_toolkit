'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface LivePreviewPanelProps {
  content: string;
  scrollPercentage: number;
  onScroll: (percentage: number) => void;
}

type Device = 'desktop' | 'tablet' | 'mobile_portrait' | 'mobile_landscape';

const deviceDimensions: Record<Device, { width: string; height: string }> = {
  desktop: { width: '100%', height: '100%' },
  tablet: { width: '768px', height: '1024px' },
  mobile_portrait: { width: '375px', height: '667px' },
  mobile_landscape: { width: '667px', height: '375px' },
};

const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({ content, scrollPercentage, onScroll }) => {
  const [selectedDevice, setSelectedDevice] = useState<Device>('desktop');
  const { theme, setTheme } = useTheme();
  const { reducedMotion, toggleReducedMotion, colorBlindMode, setColorBlindMode } = useAccessibility();
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      const scrollableHeight = previewRef.current.scrollHeight - previewRef.current.clientHeight;
      if (scrollableHeight > 0) {
        const newScrollTop = scrollPercentage * scrollableHeight;
        if (Math.abs(previewRef.current.scrollTop - newScrollTop) > 1) { // Avoid small adjustments
            previewRef.current.scrollTop = newScrollTop;
        }
      }
    }
  }, [scrollPercentage]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollableHeight = e.currentTarget.scrollHeight - e.currentTarget.clientHeight;
    if (scrollableHeight > 0) {
      const percentage = e.currentTarget.scrollTop / scrollableHeight;
      onScroll(percentage);
    }
  };

  const previewStyle: React.CSSProperties = {
    width: deviceDimensions[selectedDevice].width,
    height: deviceDimensions[selectedDevice].height,
    border: '1px solid #ccc',
    overflow: 'auto',
    margin: 'auto',
    transition: reducedMotion ? 'none' : 'width 0.3s, height 0.3s',
  };

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Live Preview</span>
        <div>
          <div className="btn-group me-2" role="group" aria-label="Accessibility Simulation">
            <button type="button" className={`btn btn-sm btn-outline-secondary ${reducedMotion ? 'active' : ''}`} onClick={toggleReducedMotion}>Reduced Motion</button>
            <div className="dropdown d-inline-block">
              <button className={`btn btn-sm btn-outline-secondary dropdown-toggle ${colorBlindMode !== 'none' ? 'active' : ''}`} type="button" id="colorblindModeDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Colorblind Friendly
              </button>
              <ul className="dropdown-menu" aria-labelledby="colorblindModeDropdown">
                <li><button className={`dropdown-item ${colorBlindMode === 'none' ? 'active' : ''}`} onClick={() => setColorBlindMode('none')}>None</button></li>
                <li><button className={`dropdown-item ${colorBlindMode === 'protanopia' ? 'active' : ''}`} onClick={() => setColorBlindMode('protanopia')}>Protanopia</button></li>
                <li><button className={`dropdown-item ${colorBlindMode === 'deuteranopia' ? 'active' : ''}`} onClick={() => setColorBlindMode('deuteranopia')}>Deuteranopia</button></li>
                <li><button className={`dropdown-item ${colorBlindMode === 'tritanopia' ? 'active' : ''}`} onClick={() => setColorBlindMode('tritanopia')}>Tritanopia</button></li>
                <li><button className={`dropdown-item ${colorBlindMode === 'achromatopsia' ? 'active' : ''}`} onClick={() => setColorBlindMode('achromatopsia')}>Achromatopsia</button></li>
              </ul>
            </div>
          </div>
          <div className="btn-group me-2" role="group" aria-label="Theme Simulation">
            <button type="button" className={`btn btn-sm btn-outline-secondary ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>Light</button>
            <button type="button" className={`btn btn-sm btn-outline-secondary ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>Dark</button>
            <button type="button" className={`btn btn-sm btn-outline-secondary ${theme === 'high_contrast' ? 'active' : ''}`} onClick={() => setTheme('high_contrast')}>High Contrast</button>
            <button type="button" className={`btn btn-sm btn-outline-secondary ${theme === 'sepia' ? 'active' : ''}`} onClick={() => setTheme('sepia')}>Sepia</button>
            <button type="button" className={`btn btn-sm btn-outline-secondary ${theme === 'solarized' ? 'active' : ''}`} onClick={() => setTheme('solarized')}>Solarized</button>
          </div>
          <div className="btn-group" role="group" aria-label="Device Simulation">
            {Object.keys(deviceDimensions).map((device) => (
              <button
                key={device}
                type="button"
                className={`btn btn-sm btn-outline-secondary ${selectedDevice === device ? 'active' : ''}`}
                onClick={() => setSelectedDevice(device as Device)}
              >
                {device.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={`card-body d-flex flex-column align-items-center justify-content-center ${theme} ${colorBlindMode !== 'none' ? colorBlindMode : ''}`}>
        <div style={previewStyle} ref={previewRef} onScroll={handleScroll}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {/* Placeholder for AI Suggestion Highlight */}
          {content.includes('AI Suggestion Applied') && (
            <div style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'yellow', padding: 5, borderRadius: 5 }}>
              AI Highlight
            </div>
          )}
          {/* Placeholder for Validation Warnings */}
          {content.includes('Warning: Content is empty') && (
            <div style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: 'red', color: 'white', padding: 5, borderRadius: 5 }}>
              Warning!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePreviewPanel;
