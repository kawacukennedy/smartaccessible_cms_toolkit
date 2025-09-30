"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const audit_accessibility_1 = require("./commands/audit-accessibility");
const migrate_content_1 = require("./commands/migrate-content");
const upload_media_1 = require("./commands/upload-media");
const create_1 = require("./commands/create");
const edit_1 = require("./commands/edit");
const onboard_1 = require("./commands/onboard");
const undo_1 = require("./commands/undo");
const redo_1 = require("./commands/redo");
const ai_scan_1 = require("./commands/ai-scan");
const list_media_1 = require("./commands/list-media");
const preview_1 = require("./commands/preview");
const publish_1 = require("./commands/publish");
const start_session_1 = require("./commands/start-session");
const telemetry_1 = require("./lib/telemetry");
const program = new commander_1.Command();
(async () => {
    await (0, telemetry_1.initializeTelemetry)();
    program
        .version('1.0.0-cli')
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
    program
        .command('create')
        .description('Create new content')
        .option('--type <type>', 'Type of content to create (e.g., page, post)', 'page')
        .option('--title <title>', 'Title of the new content')
        .action(create_1.create);
    program
        .command('edit <contentId>')
        .description('Edit existing content')
        .option('--field <field>', 'Field to edit')
        .option('--value <value>', 'New value for the field')
        .action(edit_1.edit);
    program.addCommand(onboard_1.onboardCommand);
    program.addCommand(undo_1.undoCommand);
    program.addCommand(redo_1.redoCommand);
    program.addCommand(ai_scan_1.aiScanCommand);
    program.addCommand(list_media_1.listMediaCommand);
    program.addCommand(preview_1.previewCommand);
    program.addCommand(publish_1.publishCommand);
    program.addCommand(start_session_1.startSessionCommand);
    program.parse(process.argv);
})();
