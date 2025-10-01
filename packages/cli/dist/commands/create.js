"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = void 0;
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const logger_1 = require("../lib/logger");
exports.createCommand = new commander_1.Command()
    .command('create')
    .description('Generate new content entry')
    .option('--type <template>', 'The type of content to create (e.g., page, post)', 'page')
    .option('--title <string>', 'The title of the new content')
    .option('--slug <string>', 'The slug for the new content')
    .action(async (options) => {
    (0, logger_1.logHeading)('Create New Content');
    const questions = [
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
            default: (answers) => (options.title || answers.title).toLowerCase().replace(/\s+/g, '-'),
        },
    ];
    const answers = await inquirer_1.default.prompt(questions);
    const title = options.title || answers.title;
    const slug = options.slug || answers.slug;
    const type = options.type;
    (0, logger_1.logInfo)(`You are about to create a new '${type}' with the following details:`);
    console.log(`  Title: ${title}`);
    console.log(`  Slug: ${slug}`);
    const confirmation = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'proceed',
            message: 'Do you want to proceed?',
            default: true,
        },
    ]);
    if (confirmation.proceed) {
        // Placeholder for actual content creation logic
        (0, logger_1.logSuccess)(`Successfully created new ${type} '${title}'!`);
    }
    else {
        (0, logger_1.logInfo)('Content creation cancelled.');
    }
});
