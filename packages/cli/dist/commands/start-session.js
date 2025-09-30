"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSessionCommand = void 0;
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const logger_1 = require("../lib/logger");
exports.startSessionCommand = new commander_1.Command()
    .command('start-session')
    .description('Start an interactive content creation session')
    .action(async () => {
    (0, logger_1.log)('Starting interactive content creation session...');
    const answers = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                { name: 'Create new content', value: 'create' },
                { name: 'Edit existing content', value: 'edit' },
                { name: 'Go back to main menu', value: 'back' },
            ],
        },
    ]);
    switch (answers.action) {
        case 'create':
            (0, logger_1.log)('Delegating to create command...');
            // In a real scenario, you would call the create command function here
            // For now, we'll just log the action.
            break;
        case 'edit':
            (0, logger_1.log)('Delegating to edit command...');
            // In a real scenario, you would call the edit command function here
            // For now, we'll just log the action.
            break;
        case 'back':
            (0, logger_1.log)('Returning to main menu.');
            break;
    }
});
