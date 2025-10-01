import { Command } from 'commander';
import inquirer from 'inquirer';
import { logInfo, logSuccess, logError, logHeading } from '../lib/logger';
import * as fs from 'fs';

export const initCommand = new Command()
  .command('init')
  .description('Initialize project with Storyblok connection')
  .option('--space-id <id>', 'Your Storyblok space ID')
  .option('--token <access_token>', 'Your Storyblok access token')
  .option('--config <file>', 'Path to save configuration', '.smartcmsrc')
  .action(async (options) => {
    logHeading('Initializing SmartAccessible CMS Project');

    const questions: any[] = [
      {
        type: 'input',
        name: 'spaceId',
        message: 'Enter your Storyblok space ID:',
        when: !options.spaceId,
      },
      {
        type: 'password',
        name: 'token',
        message: 'Enter your Storyblok access token:',
        when: !options.token,
      },
    ];

    const answers = await inquirer.prompt(questions);

    const config = {
      spaceId: options.spaceId || answers.spaceId,
      token: options.token || answers.token,
    };

    if (!config.spaceId || !config.token) {
      logError('Storyblok space ID and access token are required.');
      return;
    }

    try {
      fs.writeFileSync(options.config, JSON.stringify(config, null, 2));
      logSuccess(`Configuration saved to ${options.config}`);
      logInfo('Your project is now connected to Storyblok.');
    } catch (error) {
      logError('Failed to save configuration file.', error);
    }
  });