import inquirer from 'inquirer';
import { undoRedoStack } from '../lib/undoRedoStack';
import { log } from '../lib/logger';
import { trackEvent } from '../lib/telemetry';

export const create = async (options: any) => {
  log('Executing create command with options:' + JSON.stringify(options));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title for the new content:',
      when: !options.title,
    },
    {
      type: 'editor',
      name: 'content',
      message: 'Enter the content:',
    },
  ]);

  const title = options.title || answers.title;
  const content = answers.content;

  // Placeholder for create logic
  log(`\nCreating content with title: ${title}`);
  log(`Content: ${content}`);
  log('Content created successfully!');
  undoRedoStack.execute({ type: 'create', payload: { title, content } });
  trackEvent('content_save', { type: 'create', title });
};
