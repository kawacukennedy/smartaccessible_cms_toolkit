import { Command } from 'commander';
import { auditAccessibility } from './commands/audit-accessibility';
import { migrateContent } from './commands/migrate-content';

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

program.parse(process.argv);
