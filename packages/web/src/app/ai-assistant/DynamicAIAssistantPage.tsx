'use client';

import React, { useState } from 'react';
import AISuggestionsPanel from '@/components/content-editor/AISuggestionsPanel';
import AccessibilityDashboard from '@/components/content-editor/AccessibilityDashboard';
import { AISuggestion } from '@/types/ai-suggestion';
import { useUndoRedo } from '@/contexts/UndoRedoContext';

const DynamicAIAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [variationPrompt, setVariationPrompt] = useState('');
  const [generatedVariation, setGeneratedVariation] = useState('');
  const { currentContent } = useUndoRedo();

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    console.log('Applying suggestion:', suggestion);
  };

  const handleGenerateVariation = () => {
    const simulatedVariation = `Based on your prompt: "${variationPrompt}" and current content: "${currentContent.substring(0, 50)}...", here is a generated variation.`;
    setGeneratedVariation(simulatedVariation);
  };

  return (
    <div className="container mx-auto mt-4 p-4">
      <h1 className="text-3xl font-bold mb-6">AI Assistant</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="font-bold text-lg mb-4">AI Sections</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('suggestions')} className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'suggestions' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Suggestions</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('accessibility')} className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'accessibility' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Accessibility</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('variations')} className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'variations' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Variations</button>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-3/4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            {activeTab === 'suggestions' && (
              <AISuggestionsPanel onApplySuggestion={handleApplySuggestion} />
            )}
            {activeTab === 'accessibility' && (
              <AccessibilityDashboard />
            )}
            {activeTab === 'variations' && (
              <div className="p-4">
                <div className="mb-4">
                  <label htmlFor="variationPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prompt for Variation</label>
                  <textarea
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    id="variationPrompt"
                    rows={3}
                    value={variationPrompt}
                    onChange={(e) => setVariationPrompt(e.target.value)}
                    placeholder="e.g., Make it more concise, Change the tone to formal."
                  ></textarea>
                </div>
                <button onClick={handleGenerateVariation} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-80 mb-4">
                  Generate Variation
                </button>
                {generatedVariation && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                    <h6 className="font-bold mb-2">Generated Variation:</h6>
                    <p>{generatedVariation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicAIAssistantPage;
