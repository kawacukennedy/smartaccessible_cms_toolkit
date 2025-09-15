'use client';

import React, { useState } from 'react';

interface LivePreviewPanelProps {
  content: string;
}

type Device = 'desktop' | 'tablet' | 'mobile_portrait' | 'mobile_landscape';

const deviceDimensions: Record<Device, { width: string; height: string }> = {
  desktop: { width: '100%', height: '100%' },
  tablet: { width: '768px', height: '1024px' },
  mobile_portrait: { width: '375px', height: '667px' },
  mobile_landscape: { width: '667px', height: '375px' },
};

const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({ content }) => {
  const [selectedDevice, setSelectedDevice] = useState<Device>('desktop');

  const previewStyle: React.CSSProperties = {
    width: deviceDimensions[selectedDevice].width,
    height: deviceDimensions[selectedDevice].height,
    border: '1px solid #ccc',
    overflow: 'auto',
    margin: 'auto',
    transition: 'width 0.3s, height 0.3s',
  };

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Live Preview</span>
        <div>
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
      <div className="card-body d-flex flex-column align-items-center justify-content-center">
        <div style={previewStyle}>
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
