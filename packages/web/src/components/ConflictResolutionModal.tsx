'use client';

import React from 'react';

interface ConflictResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (resolvedContent: string) => void;
  serverContent: string;
  localContent: string;
}

const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({ isOpen, onClose, onResolve, serverContent, localContent }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Resolve Conflicts</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>A conflict was detected. Please resolve the differences below.</p>
            <div className="row">
              <div className="col-md-6">
                <h6>Server Version</h6>
                <pre className="bg-light p-3">{serverContent}</pre>
              </div>
              <div className="col-md-6">
                <h6>Your Version</h6>
                <pre className="bg-light p-3">{localContent}</pre>
              </div>
            </div>
            <div className="mt-3">
              <h6>Resolved Content</h6>
              <textarea
                className="form-control"
                rows={10}
                defaultValue={`${localContent}
---MERGED---
${serverContent}`}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={() => {
              const resolvedContent = document.querySelector('textarea')!.value;
              onResolve(resolvedContent);
            }}>Save Merged</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionModal;
