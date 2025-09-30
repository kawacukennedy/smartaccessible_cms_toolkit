
import { Command } from 'commander';
import { undoRedoStack } from '../lib/undoRedoStack';
import { log } from '../lib/logger';
import { trackEvent } from '../lib/telemetry';

export const undoCommand = new Command()
  .command('undo')
  .description('Undo the last action')
  .action(() => {
    const undoneAction = undoRedoStack.undo();
    if (undoneAction) {
      log('Action undone');
      trackEvent('undo', { actionType: undoneAction.type });
    } else {
      log('No action to undo.');
    }
  });
