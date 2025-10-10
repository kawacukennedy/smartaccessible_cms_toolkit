import { Command } from 'commander';
import { initCommand } from './commands/onboard';
import { createCommand } from './commands/create';
import { edit } from './commands/edit';
import { scanCommand } from './commands/ai-scan';
import { auditAccessibility } from './commands/audit-accessibility';
import { previewCommand } from './commands/preview';
import { deployCommand } from './commands/publish';
import { undoCommand } from './commands/undo';
import { redoCommand } from './commands/redo';
import { uploadMedia } from './commands/upload-media';
import { listMediaCommand } from './commands/list-media';
import { migrateContent } from './commands/migrate-content';
import { resolveConflictsCommand } from './commands/resolve-conflicts';
import { startSessionCommand } from './commands/start-session';
import { initializeTelemetry } from './lib/telemetry';

const program = new Command();

(async () => {
  await initializeTelemetry();

  program
    .name('smartcms')
    .version('1.0.0')
    .description('A CLI for the SmartAccessible CMS Toolkit');

  program.addCommand(initCommand);
  program.addCommand(createCommand);
  program.addCommand(scanCommand);
  program.addCommand(previewCommand);
  program.addCommand(deployCommand);
  program.addCommand(undoCommand);
  program.addCommand(redoCommand);
  program.addCommand(listMediaCommand);
  program.addCommand(resolveConflictsCommand);
  program.addCommand(startSessionCommand);

  // Commands that are functions, wrap in Command
  const editCommand = new Command()
    .command('edit <contentId>')
    .description('Edit existing content')
    .option('--field <field>', 'Field to edit')
    .option('--value <value>', 'New value')
    .action(async (contentId, options) => {
      await edit(contentId, options);
    });

  const auditCommand = new Command()
    .command('audit-accessibility')
    .description('Audit content for accessibility issues')
    .option('--space <space>', 'Space ID', 'default')
    .option('--locale <locale>', 'Locale', 'en')
    .option('--include-ai-suggestions', 'Include AI suggestions', false)
    .option('--output-file <file>', 'Output file', 'accessibility-report.json')
    .action(async (options) => {
      await auditAccessibility(options);
    });

  const uploadCommand = new Command()
    .command('upload-media <filePath>')
    .description('Upload media file')
    .option('--alt-text <text>', 'Alt text for image')
    .option('--generate-alt', 'Generate alt text with AI', false)
    .action(async (filePath, options) => {
      await uploadMedia(filePath, options);
    });

  const migrateCommand = new Command()
    .command('migrate-content')
    .description('Migrate content from one space to another')
    .option('--source-space <id>', 'Source space ID')
    .option('--target-space <id>', 'Target space ID')
    .option('--dry-run', 'Dry run without actual migration', false)
    .action(async (options) => {
      await migrateContent(options);
    });

  program.addCommand(editCommand);
  program.addCommand(auditCommand);
  program.addCommand(uploadCommand);
  program.addCommand(migrateCommand);

  program.parse(process.argv);
})();