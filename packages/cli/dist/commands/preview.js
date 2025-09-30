"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewCommand = void 0;
const commander_1 = require("commander");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../lib/logger");
const telemetry_1 = require("../lib/telemetry");
exports.previewCommand = new commander_1.Command()
    .command('preview')
    .description('Preview a piece of content')
    .requiredOption('--id <id>', 'The ID of the content to preview')
    .action(async (options) => {
    (0, logger_1.log)(`Generating preview for content ID: ${options.id}`);
    try {
        // 1. Fetch content (simulated from project.json)
        (0, logger_1.log)('Fetching content...');
        const projectJsonPath = path_1.default.join(process.cwd(), '..', '..', 'project.json');
        const fileContents = await fs_1.promises.readFile(projectJsonPath, 'utf8');
        const projectData = JSON.parse(fileContents);
        const contentBlock = projectData.mock_data.ContentBlock.sample;
        // 2. Generate a simple HTML preview
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>
            body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
            h1 { color: #333; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <h1>${contentBlock.title}</h1>
          <div>${contentBlock.content}</div>
        </body>
        </html>
      `;
        // 3. Save the preview to a file
        const previewPath = path_1.default.join(process.cwd(), 'preview.html');
        await fs_1.promises.writeFile(previewPath, html);
        (0, logger_1.log)(`\nPreview generated successfully!`);
        (0, logger_1.log)(`Open this file in your browser: ${previewPath}`);
        (0, telemetry_1.trackEvent)('preview', { contentId: options.id });
    }
    catch (error) {
        (0, logger_1.logError)('Error during preview generation:', error);
        process.exit(1);
    }
});
