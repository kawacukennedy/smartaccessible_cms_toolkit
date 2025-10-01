'use client';

import React from 'react';

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
  { id: 'blank', name: 'Blank Page', description: 'Start with an empty canvas.', previewImage: 'https://via.placeholder.com/150/F0F0F0/808080?text=Blank' },
  { id: 'article', name: 'Article Template', description: 'A standard layout for articles.', previewImage: 'https://via.placeholder.com/150/E0E0E0/808080?text=Article' },
  { id: 'landing', name: 'Landing Page', description: 'For marketing and lead generation.', previewImage: 'https://via.placeholder.com/150/D0D0D0/808080?text=Landing' },
  { id: 'product', name: 'Product Page', description: 'Showcase your products.', previewImage: 'https://via.placeholder.com/150/C0C0C0/808080?text=Product' },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate, selectedTemplateId }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelectTemplate(template.id)}
          className={`relative p-4 border rounded-lg cursor-pointer transition-all ${selectedTemplateId === template.id ? 'border-primary ring-2 ring-primary' : 'border-gray-300 dark:border-gray-600'}`}>
          <img src={template.previewImage} alt={template.name} className="w-full h-32 object-cover rounded-md mb-4" />
          <h3 className="font-bold text-lg">{template.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
          {selectedTemplateId === template.id && (
            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TemplateSelector;