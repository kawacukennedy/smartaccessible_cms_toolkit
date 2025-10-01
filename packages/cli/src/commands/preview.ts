import { Command } from 'commander';
import { logInfo, logSuccess, logError, logHeading } from '../lib/logger';

export const previewCommand = new Command()
  .command('preview <contentId>')
  .description('Generate a live preview link for a content entry')
  .option('--device <device>', 'Simulate a device (desktop, tablet, mobile)', 'desktop')
  .option('--expires <minutes>', 'Set the expiration time for the link in minutes', '60')
  .action((contentId, options) => {
    logHeading(`Generating Preview Link for Content ID: ${contentId}`);

    try {
      // Placeholder for generating a signed preview URL from a service like Storyblok
      const baseUrl = 'https://preview.smartaccessiblecms.com';
      const token = `token_${Math.random().toString(36).substring(2)}`;
      const expires = new Date().getTime() + Number(options.expires) * 60 * 1000;

      const previewUrl = `${baseUrl}/${contentId}?device=${options.device}&expires=${expires}&token=${token}`;

      logSuccess('Successfully generated preview link:');
      console.log(previewUrl);

    } catch (error) {
      logError(`Failed to generate preview link for content ID: ${contentId}`, error);
      process.exit(1);
    }
  });