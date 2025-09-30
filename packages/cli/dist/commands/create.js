"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const create = async (options) => {
    console.log('Executing create command with options:', options);
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title for the new content:',
            when: !options.title,
        },
        {
            type: 'editor',
            name: 'content',
            message: 'Enter the content:',
        },
    ]);
    const title = options.title || answers.title;
    const content = answers.content;
    // Placeholder for create logic
    console.log(`\nCreating content with title: ${title}`);
    console.log(`Content: ${content}`);
    console.log('Content created successfully!');
};
exports.create = create;
