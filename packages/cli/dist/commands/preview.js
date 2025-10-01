"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewCommand = void 0;
const commander_1 = require("commander");
const logger_1 = require("../lib/logger");
exports.previewCommand = new commander_1.Command()
    .command('preview <contentId>')
    .description('Generate a live preview link for a content entry')
    .option('--device <device>', 'Simulate a device (desktop, tablet, mobile)', 'desktop')
    .option('--expires <minutes>', 'Set the expiration time for the link in minutes', '60')
    .action((contentId, options) => {
    (0, logger_1.logHeading)(`Generating Preview Link for Content ID: ${contentId}`);
    try {
        // Placeholder for generating a signed preview URL from a service like Storyblok
        const baseUrl = 'https://preview.smartaccessiblecms.com';
        const token = `token_${Math.random().toString(36).substring(2)}`;
        const expires = new Date().getTime() + Number(options.expires) * 60 * 1000;
        const previewUrl = `${baseUrl}/${contentId}?device=${options.device}&expires=${expires}&token=${token}`;
        (0, logger_1.logSuccess)('Successfully generated preview link:');
        console.log(previewUrl);
    }
    catch (error) {
        (0, logger_1.logError)(`Failed to generate preview link for content ID: ${contentId}`, error);
        process.exit(1);
    }
});
