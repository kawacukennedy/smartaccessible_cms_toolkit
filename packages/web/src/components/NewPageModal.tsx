'use client';

import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import TemplateSelector from './TemplateSelector'; // Import the new TemplateSelector

interface NewPageModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (title: string, slug: string, template: string, seoTitle: string, seoDescription: string) => void;
}

const NewPageModal: React.FC<NewPageModalProps> = ({ show, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank'); // Default template

  const [titleError, setTitleError] = useState('');
  const [slugError, setSlugError] = useState('');

  const validateForm = () => {
    let isValid = true;
    if (!title.trim()) {
      setTitleError('Page Title is required.');
      isValid = false;
    } else {
      setTitleError('');
    }

    if (!slug.trim()) {
      setSlugError('Page Slug is required.');
      isValid = false;
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setSlugError('Slug must be lowercase, alphanumeric, and use hyphens for spaces.');
      isValid = false;
    } else {
      setSlugError('');
    }
    return isValid;
  };

  const handleCreate = () => {
    if (validateForm()) {
      onCreate(title, slug, selectedTemplate, seoTitle, seoDescription);
      setTitle('');
      setSlug('');
      setSeoTitle('');
      setSeoDescription('');
      setSelectedTemplate('blank');
      onClose(); // Close modal on successful creation
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg"> {/* Increased modal size */}
      <Modal.Header closeButton>
        <Modal.Title>Create New Page</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="pageTitle">
            <Form.Label>Page Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter page title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!titleError}
              required
            />
            <Form.Control.Feedback type="invalid">{titleError}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="pageSlug">
            <Form.Label>Page Slug</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter-page-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              isInvalid={!!slugError}
              required
            />
            <Form.Control.Feedback type="invalid">{slugError}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="seoTitle">
            <Form.Label>SEO Title (Optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter SEO title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="seoDescription">
            <Form.Label>SEO Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter SEO description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="pageTemplate">
            <Form.Label>Select Template</Form.Label>
            <TemplateSelector
              onSelectTemplate={setSelectedTemplate}
              selectedTemplateId={selectedTemplate}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Create Page
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewPageModal;
