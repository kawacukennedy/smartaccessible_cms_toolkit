"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const audit_accessibility_1 = require("./commands/audit-accessibility");
const migrate_content_1 = require("./commands/migrate-content");
const upload_media_1 = require("./commands/upload-media");
const program = new commander_1.Command();
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
    .action(audit_accessibility_1.auditAccessibility);
program
    .command('migrate-content')
    .description('Migrate content between Storyblok spaces')
    .requiredOption('--source-space <sourceSpace>', 'The source Storyblok space ID or slug')
    .requiredOption('--destination-space <destinationSpace>', 'The destination Storyblok space ID or slug')
    .option('--include-media', 'Include media assets in the migration', true)
    .option('--dry-run', 'Perform a dry run without making actual changes', false)
    .option('--verbose', 'Enable verbose logging', false)
    .action(migrate_content_1.migrateContent);
program
    .command('upload-media <filePath>')
    .description('Upload a media file')
    .option('--generate-alt-text', 'Automatically generate AI alt text for the media', false)
    .action(upload_media_1.uploadMedia);
program.parse(process.argv);
