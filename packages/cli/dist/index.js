"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const onboard_1 = require("./commands/onboard");
const create_1 = require("./commands/create");
const edit_1 = require("./commands/edit");
const ai_scan_1 = require("./commands/ai-scan");
const audit_accessibility_1 = require("./commands/audit-accessibility");
const preview_1 = require("./commands/preview");
const publish_1 = require("./commands/publish");
const undo_1 = require("./commands/undo");
const redo_1 = require("./commands/redo");
const upload_media_1 = require("./commands/upload-media");
const list_media_1 = require("./commands/list-media");
const migrate_content_1 = require("./commands/migrate-content");
const resolve_conflicts_1 = require("./commands/resolve-conflicts");
const start_session_1 = require("./commands/start-session");
const telemetry_1 = require("./lib/telemetry");
const program = new commander_1.Command();
(async () => {
    await (0, telemetry_1.initializeTelemetry)();
    program
        .name('smartcms')
        .version('1.0.0')
        .description('A CLI for the SmartAccessible CMS Toolkit');
    program.addCommand(onboard_1.initCommand);
    program.addCommand(create_1.createCommand);
    program.addCommand(ai_scan_1.scanCommand);
    program.addCommand(preview_1.previewCommand);
    program.addCommand(publish_1.deployCommand);
    program.addCommand(undo_1.undoCommand);
    program.addCommand(redo_1.redoCommand);
    program.addCommand(list_media_1.listMediaCommand);
    program.addCommand(resolve_conflicts_1.resolveConflictsCommand);
    program.addCommand(start_session_1.startSessionCommand);
    // Commands that are functions, wrap in Command
    const editCommand = new commander_1.Command()
        .command('edit <contentId>')
        .description('Edit existing content')
        .option('--field <field>', 'Field to edit')
        .option('--value <value>', 'New value')
        .action(async (contentId, options) => {
        await (0, edit_1.edit)(contentId, options);
    });
    const auditCommand = new commander_1.Command()
        .command('audit-accessibility')
        .description('Audit content for accessibility issues')
        .option('--space <space>', 'Space ID', 'default')
        .option('--locale <locale>', 'Locale', 'en')
        .option('--include-ai-suggestions', 'Include AI suggestions', false)
        .option('--output-file <file>', 'Output file', 'accessibility-report.json')
        .action(async (options) => {
        await (0, audit_accessibility_1.auditAccessibility)(options);
    });
    const uploadCommand = new commander_1.Command()
        .command('upload-media <filePath>')
        .description('Upload media file')
        .option('--alt-text <text>', 'Alt text for image')
        .option('--generate-alt', 'Generate alt text with AI', false)
        .action(async (filePath, options) => {
        await (0, upload_media_1.uploadMedia)(filePath, options);
    });
    const migrateCommand = new commander_1.Command()
        .command('migrate-content')
        .description('Migrate content from one space to another')
        .option('--source-space <id>', 'Source space ID')
        .option('--target-space <id>', 'Target space ID')
        .option('--dry-run', 'Dry run without actual migration', false)
        .action(async (options) => {
        await (0, migrate_content_1.migrateContent)(options);
    });
    program.addCommand(editCommand);
    program.addCommand(auditCommand);
    program.addCommand(uploadCommand);
    program.addCommand(migrateCommand);
    program.parse(process.argv);
})();
