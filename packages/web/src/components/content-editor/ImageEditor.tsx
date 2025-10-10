'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Crop, RotateCw, ZoomIn, ZoomOut, Save, X } from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string;
  imageName: string;
  onSave: (editedImageUrl: string, metadata: ImageMetadata) => void;
  onCancel: () => void;
  isOpen: boolean;
}

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  cropArea?: { x: number; y: number; width: number; height: number };
  rotation: number;
  quality: number;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUrl,
  imageName,
  onSave,
  onCancel,
  isOpen
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [quality, setQuality] = useState(0.9);
  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Load image
  useEffect(() => {
    if (isOpen && imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImage(img);
        drawImage(img);
      };
      img.src = imageUrl;
      imageRef.current = img;
    }
  }, [imageUrl, isOpen]);

  // Draw image on canvas
  const drawImage = useCallback((img: HTMLImageElement, crop?: typeof cropArea) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to image size
    canvas.width = img.width;
    canvas.height = img.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw image
    if (crop) {
      ctx.drawImage(
        img,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, canvas.width, canvas.height
      );
    } else {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    // Restore context
    ctx.restore();

    // Draw crop overlay if cropping
    if (isCropping && cropArea) {
      ctx.strokeStyle = '#007bff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

      // Draw corner handles
      ctx.fillStyle = '#007bff';
      const handleSize = 8;
      const handles = [
        { x: cropArea.x, y: cropArea.y },
        { x: cropArea.x + cropArea.width, y: cropArea.y },
        { x: cropArea.x, y: cropArea.y + cropArea.height },
        { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height },
      ];

      handles.forEach(handle => {
        ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
      });
    }
  }, [scale, rotation, isCropping, cropArea]);

  // Redraw when parameters change
  useEffect(() => {
    if (image) {
      drawImage(image, cropArea || undefined);
    }
  }, [image, scale, rotation, cropArea, isCropping, drawImage]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.1));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleCrop = () => {
    setIsCropping(!isCropping);
    if (!isCropping) {
      setCropArea(null);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCropping) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragStart({ x, y });
    setCropArea({ x, y, width: 0, height: 0 });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCropping || !dragStart) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = x - dragStart.x;
    const height = y - dragStart.y;

    setCropArea({
      x: Math.min(dragStart.x, x),
      y: Math.min(dragStart.y, y),
      width: Math.abs(width),
      height: Math.abs(height),
    });
  };

  const handleCanvasMouseUp = () => {
    setDragStart(null);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    // Create final canvas with crop and transformations
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return;

    let sourceX = 0, sourceY = 0, sourceWidth = image.width, sourceHeight = image.height;

    if (cropArea) {
      sourceX = cropArea.x;
      sourceY = cropArea.y;
      sourceWidth = cropArea.width;
      sourceHeight = cropArea.height;
    }

    finalCanvas.width = sourceWidth;
    finalCanvas.height = sourceHeight;

    // Apply rotation and scaling to final image
    finalCtx.save();
    finalCtx.translate(sourceWidth / 2, sourceHeight / 2);
    finalCtx.rotate((rotation * Math.PI) / 180);
    finalCtx.scale(scale, scale);
    finalCtx.translate(-sourceWidth / 2, -sourceHeight / 2);

    finalCtx.drawImage(
      image,
      sourceX, sourceY, sourceWidth, sourceHeight,
      -sourceWidth / 2, -sourceHeight / 2, sourceWidth, sourceHeight
    );
    finalCtx.restore();

    // Convert to blob
    finalCanvas.toBlob((blob) => {
      if (blob) {
        const editedUrl = URL.createObjectURL(blob);
        const metadata: ImageMetadata = {
          width: finalCanvas.width,
          height: finalCanvas.height,
          format: 'image/jpeg',
          size: blob.size,
          cropArea: cropArea || undefined,
          rotation,
          quality,
        };
        onSave(editedUrl, metadata);
      }
    }, 'image/jpeg', quality);
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Image: {imageName}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <div className="d-flex justify-content-center mb-3">
                <canvas
                  ref={canvasRef}
                  className="border"
                  style={{ maxWidth: '100%', maxHeight: '400px', cursor: isCropping ? 'crosshair' : 'default' }}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
              </div>

              <div className="d-flex justify-content-center gap-2 mb-3">
                <button
                  className={`btn btn-sm ${isCropping ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={handleCrop}
                  title="Crop"
                >
                  <Crop size={16} />
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={handleZoomOut} title="Zoom Out">
                  <ZoomOut size={16} />
                </button>
                <span className="align-self-center">{Math.round(scale * 100)}%</span>
                <button className="btn btn-sm btn-outline-secondary" onClick={handleZoomIn} title="Zoom In">
                  <ZoomIn size={16} />
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={handleRotate} title="Rotate">
                  <RotateCw size={16} />
                </button>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="quality" className="form-label">Quality: {Math.round(quality * 100)}%</label>
                  <input
                    type="range"
                    className="form-range"
                    id="quality"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                  />
                </div>
                <div className="col-md-6">
                  <p className="mb-1">Rotation: {rotation}°</p>
                  <p className="mb-0 text-muted">
                    {cropArea ? `Crop: ${cropArea.width} x ${cropArea.height}` : 'No crop selected'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              <X size={16} className="me-1" />
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              <Save size={16} className="me-1" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;