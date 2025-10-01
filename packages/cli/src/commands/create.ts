import { Command } from 'commander';
import inquirer from 'inquirer';
import { logInfo, logSuccess, logError, logHeading } from '../lib/logger';

export const createCommand = new Command()
  .command('create')
  .description('Generate new content entry')
  .option('--type <template>', 'The type of content to create (e.g., page, post)', 'page')
  .option('--title <string>', 'The title of the new content')
  .option('--slug <string>', 'The slug for the new content')
  .action(async (options) => {
    logHeading('Create New Content');

    const questions: any[] = [
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title for the new content:',
        when: !options.title,
      },
      {
        type: 'input',
        name: 'slug',
        message: 'Enter the slug for the new content:',
        when: !options.slug,
        default: (answers: any) => (options.title || answers.title).toLowerCase().replace(/\s+/g, '-'),
      },
    ];

    const answers = await inquirer.prompt(questions);

    const title = options.title || answers.title;
    const slug = options.slug || answers.slug;
    const type = options.type;

    logInfo(`You are about to create a new '${type}' with the following details:`);
    console.log(`  Title: ${title}`);
    console.log(`  Slug: ${slug}`);

    const confirmation = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Do you want to proceed?',
        default: true,
      },
    ]);

    if (confirmation.proceed) {
      // Placeholder for actual content creation logic
      logSuccess(`Successfully created new ${type} '${title}'!`);
    } else {
      logInfo('Content creation cancelled.');
    }
  });