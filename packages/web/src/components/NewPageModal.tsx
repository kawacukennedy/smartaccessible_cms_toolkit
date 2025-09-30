'use client';

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface NewPageModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (title: string, slug: string, template: string) => void;
}

const NewPageModal: React.FC<NewPageModalProps> = ({ show, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank'); // Default template

  const handleCreate = () => {
    if (title.trim() && slug.trim()) {
      onCreate(title, slug, selectedTemplate);
      setTitle('');
      setSlug('');
      setSelectedTemplate('blank');
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
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
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="pageSlug">
            <Form.Label>Page Slug</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter-page-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="pageTemplate">
            <Form.Label>Select Template</Form.Label>
            <Form.Select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
              <option value="blank">Blank Page</option>
              <option value="article">Article Template</option>
              <option value="landing">Landing Page Template</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreate} disabled={!title.trim() || !slug.trim()}>
          Create Page
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewPageModal;
