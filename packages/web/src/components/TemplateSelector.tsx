
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

interface Template {
  id: string;
  name: string;
  description: string;
  previewImage: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId: string;
}

const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Page',
    description: 'Start with an empty canvas.',
    previewImage: 'https://via.placeholder.com/150/F0F0F0/808080?text=Blank',
  },
  {
    id: 'article',
    name: 'Article Template',
    description: 'A standard layout for articles and blog posts.',
    previewImage: 'https://via.placeholder.com/150/E0E0E0/808080?text=Article',
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Designed for marketing and lead generation.',
    previewImage: 'https://via.placeholder.com/150/D0D0D0/808080?text=Landing',
  },
  {
    id: 'product',
    name: 'Product Page',
    description: 'Showcase your products with details and images.',
    previewImage: 'https://via.placeholder.com/150/C0C0C0/808080?text=Product',
  },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectTemplate,
  selectedTemplateId,
}) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const templateRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (templateRefs.current[focusedIndex]) {
      templateRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % templates.length);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + templates.length) % templates.length);
          break;
        case 'Enter':
          event.preventDefault();
          onSelectTemplate(templates[focusedIndex].id);
          break;
        case 'Escape':
          event.preventDefault();
          // Optionally, blur focus or close the modal
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedIndex, onSelectTemplate]);

  return (
    <div className="template-selector" role="radiogroup" aria-label="Select a page template">
      <Row>
        {templates.map((template, index) => (
          <Col md={6} lg={4} className="mb-4" key={template.id}>
            <Card
              ref={(el) => (templateRefs.current[index] = el)}
              className={`template-card ${selectedTemplateId === template.id ? 'border-primary border-2' : ''}`}
              onClick={() => onSelectTemplate(template.id)}
              onFocus={() => setFocusedIndex(index)}
              tabIndex={0} // Make card focusable
              role="radio"
              aria-checked={selectedTemplateId === template.id}
              aria-label={template.name}
            >
              <Card.Img variant="top" src={template.previewImage} alt={`Preview of ${template.name}`} />
              <Card.Body>
                <Card.Title>{template.name}</Card.Title>
                <Card.Text>{template.description}</Card.Text>
                {selectedTemplateId === template.id && (
                  <div className="position-absolute top-0 end-0 p-2">
                    <i className="bi bi-check-circle-fill text-primary fs-4"></i>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TemplateSelector;
