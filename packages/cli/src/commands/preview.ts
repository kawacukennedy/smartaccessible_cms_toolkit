
import { Command } from 'commander';
import { promises as fs } from 'fs';
import path from 'path';
import { log, logError } from '../lib/logger';
import { trackEvent } from '../lib/telemetry';

export const previewCommand = new Command()
  .command('preview')
  .description('Preview a piece of content')
  .requiredOption('--id <id>', 'The ID of the content to preview')
  .action(async (options) => {
    log(`Generating preview for content ID: ${options.id}`);

    try {
      // 1. Fetch content (simulated from project.json)
      log('Fetching content...');
      const projectJsonPath = path.join(process.cwd(), '..', '..', 'project.json');
      const fileContents = await fs.readFile(projectJsonPath, 'utf8');
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
      const previewPath = path.join(process.cwd(), 'preview.html');
      await fs.writeFile(previewPath, html);

      log(`\nPreview generated successfully!`);
      log(`Open this file in your browser: ${previewPath}`);
      trackEvent('preview', { contentId: options.id });

    } catch (error) {
      logError('Error during preview generation:', error);
      process.exit(1);
    }
  });
