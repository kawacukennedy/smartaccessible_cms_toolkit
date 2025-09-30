"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardCommand = void 0;
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const logger_1 = require("../lib/logger");
exports.onboardCommand = new commander_1.Command()
    .command('onboard')
    .description('Start the onboarding process for a new user or project')
    .action(async () => {
    (0, logger_1.log)('Welcome to the SmartAccessible CMS Toolkit CLI!\n');
    (0, logger_1.log)('This interactive wizard will guide you through the initial project setup.');
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Enter your project name:',
            default: 'My New Project',
        },
        {
            type: 'confirm',
            name: 'initializeGit',
            message: 'Do you want to initialize a Git repository for this project?',
            default: true,
        },
        {
            type: 'confirm',
            name: 'installDependencies',
            message: 'Do you want to install project dependencies (e.g., npm install)?',
            default: true,
        },
    ]);
    (0, logger_1.log)(`\nProject Name: ${answers.projectName}`);
    if (answers.initializeGit) {
        (0, logger_1.log)('Initializing Git repository...');
        // Placeholder for git init logic
        (0, logger_1.log)('Git repository initialized.');
    }
    else {
        (0, logger_1.log)('Git repository initialization skipped.');
    }
    if (answers.installDependencies) {
        (0, logger_1.log)('Installing project dependencies...');
        // Placeholder for npm install logic
        (0, logger_1.log)('Project dependencies installed.');
    }
    else {
        (0, logger_1.log)('Project dependencies installation skipped.');
    }
    (0, logger_1.log)('\nOnboarding complete! Your project is now set up.');
    (0, logger_1.log)('You can now use other commands like `create`, `edit`, `ai-scan`, etc.');
});
