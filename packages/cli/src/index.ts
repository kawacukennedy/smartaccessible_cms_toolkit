import { Command } from 'commander';
import { auditAccessibility } from './commands/audit-accessibility';
import { migrateContent } from './commands/migrate-content';
import { uploadMedia } from './commands/upload-media';
import { create } from './commands/create';
import { edit } from './commands/edit';
import { onboardCommand } from './commands/onboard';
import { undoCommand } from './commands/undo';
import { redoCommand } from './commands/redo';
import { aiScanCommand } from './commands/ai-scan';
import { listMediaCommand } from './commands/list-media';
import { previewCommand } from './commands/preview';
import { publishCommand } from './commands/publish';

const program = new Command();

program
  .version('1.0.0')
  .description('A CLI for the SmartAccessible CMS Toolkit');

program
  .command('audit-accessibility')
  .description('Run an accessibility audit on a space')
  .requiredOption('--space <space>', 'The space to audit')
  .requiredOption('--output-file <outputFile>', 'The path to the output file')
  .option('--include-ai-suggestions', 'Include AI suggestions in the report', true)
  .option('--locale <locale>', 'The locale to audit', 'all')
  .action(auditAccessibility);

program
  .command('migrate-content')
  .description('Migrate content between Storyblok spaces')
  .requiredOption('--source-space <sourceSpace>', 'The source Storyblok space ID or slug')
  .requiredOption('--destination-space <destinationSpace>', 'The destination Storyblok space ID or slug')
  .option('--include-media', 'Include media assets in the migration', true)
  .option('--dry-run', 'Perform a dry run without making actual changes', false)
  .option('--verbose', 'Enable verbose logging', false)
  .action(migrateContent);

program
  .command('upload-media <filePath>')
  .description('Upload a media file')
  .option('--generate-alt-text', 'Automatically generate AI alt text for the media', false)
  .action(uploadMedia);

program
  .command('create')
  .description('Create new content')
  .option('--type <type>', 'Type of content to create (e.g., page, post)', 'page')
  .option('--title <title>', 'Title of the new content')
  .action(create);

program
  .command('edit <contentId>')
  .description('Edit existing content')
  .option('--field <field>', 'Field to edit')
  .option('--value <value>', 'New value for the field')
  .action(edit);

program.addCommand(onboardCommand);
program.addCommand(undoCommand);
program.addCommand(redoCommand);
program.addCommand(aiScanCommand);
program.addCommand(listMediaCommand);
program.addCommand(previewCommand);
program.addCommand(publishCommand);

program.parse(process.argv);
