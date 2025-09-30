
import { Command } from 'commander';
import { undoRedoStack } from '../lib/undoRedoStack';
import { log } from '../lib/logger';
import { trackEvent } from '../lib/telemetry';

export const redoCommand = new Command()
  .command('redo')
  .description('Redo the last undone action')
  .action(() => {
    const redoneAction = undoRedoStack.redo();
    if (redoneAction) {
      log('Action redone');
      trackEvent('redo', { actionType: redoneAction.type });
    } else {
      log('No action to redo.');
    }
  });
