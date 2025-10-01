"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployCommand = void 0;
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const logger_1 = require("../lib/logger");
exports.deployCommand = new commander_1.Command()
    .command('deploy [contentId]')
    .description('Deploy content to Storyblok')
    .option('--env <env>', 'The environment to deploy to (staging|production)', 'staging')
    .option('--dry-run', 'Perform a dry run without making actual changes', false)
    .action(async (contentId, options) => {
    (0, logger_1.logHeading)(`Deploying to ${options.env.toUpperCase()}`);
    if (options.dryRun) {
        (0, logger_1.logInfo)('Performing a dry run...');
    }
    try {
        // Placeholder for fetching content and generating a diff
        const diff = [
            { type: 'modified', item: 'page/home' },
            { type: 'added', item: 'post/new-features' },
            { type: 'deleted', item: 'page/about-us-old' },
        ];
        (0, logger_1.logInfo)('The following changes will be deployed:');
        diff.forEach(change => {
            let color;
            let symbol;
            switch (change.type) {
                case 'modified':
                    color = 'yellow';
                    symbol = '~';
                    break;
                case 'added':
                    color = 'green';
                    symbol = '+';
                    break;
                case 'deleted':
                    color = 'red';
                    symbol = '-';
                    break;
            }
            console.log(`  ${symbol} ${change.item}`);
        });
        const { confirm } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: `Are you sure you want to deploy these changes to ${options.env}?`,
                default: false,
            },
        ]);
        if (confirm) {
            if (options.dryRun) {
                (0, logger_1.logSuccess)('Dry run complete. No changes were made.');
            }
            else {
                // Placeholder for actual deployment logic
                (0, logger_1.logSuccess)(`Successfully deployed changes to ${options.env}.`);
            }
        }
        else {
            (0, logger_1.logWarning)('Deployment cancelled.');
        }
    }
    catch (error) {
        (0, logger_1.logError)('Failed to deploy changes.', error);
        process.exit(1);
    }
});
