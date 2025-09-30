import inquirer from 'inquirer';
import { undoRedoStack } from '../lib/undoRedoStack';
import { log } from '../lib/logger';
import { trackEvent } from '../lib/telemetry';

export const edit = async (contentId: string, options: any) => {
  log(`Executing edit command for content ID: ${contentId} with options:` + JSON.stringify(options));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'field',
      message: 'Enter the field to edit:',
      when: !options.field,
    },
    {
      type: 'editor',
      name: 'value',
      message: 'Enter the new value:',
      when: !options.value,
    },
  ]);

  const field = options.field || answers.field;
  const value = options.value || answers.value;

  // Placeholder for edit logic
  log(`\nEditing field: ${field}`);
  log(`New value: ${value}`);
  log('Content edited successfully!');
  undoRedoStack.execute({ type: 'edit', payload: { contentId, field, value } });
  trackEvent('content_save', { type: 'edit', contentId, field });
};
