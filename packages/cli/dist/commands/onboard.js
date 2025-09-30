"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardCommand = void 0;
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
exports.onboardCommand = new commander_1.Command()
    .command('onboard')
    .description('Interactive onboarding wizard')
    .action(async () => {
    console.log('Welcome to the SmartAccessible CMS Toolkit CLI!\n');
    const answers = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do first?',
            choices: [
                { name: 'Create a new piece of content', value: 'create' },
                { name: 'Edit an existing piece of content', value: 'edit' },
                { name: 'Run an AI scan on your content', value: 'ai_scan' },
                { name: 'Preview your content', value: 'preview' },
                { name: 'Publish your content', value: 'publish' },
                new inquirer_1.default.Separator(),
                { name: 'Exit', value: 'exit' },
            ],
        },
    ]);
    switch (answers.action) {
        case 'create':
            console.log('\nTo create a new piece of content, use the `create` command.');
            console.log('Example: `create --title "My New Post" --content "Hello, world!"`');
            break;
        case 'edit':
            console.log('\nTo edit an existing piece of content, use the `edit` command.');
            console.log('Example: `edit --id 123 --content "Updated content."`');
            break;
        case 'ai_scan':
            console.log('\nTo run an AI scan, use the `ai-scan` command.');
            console.log('Example: `ai-scan --id 123`');
            break;
        case 'preview':
            console.log('\nTo preview your content, you would typically open it in a browser.');
            console.log('This CLI tool focuses on content management, not rendering.');
            break;
        case 'publish':
            console.log('\nTo publish your content, use the `publish` command.');
            console.log('Example: `publish --id 123`');
            break;
        case 'exit':
            console.log('\nGoodbye!');
            break;
    }
});
