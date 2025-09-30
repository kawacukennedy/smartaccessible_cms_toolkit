"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const undoRedoStack_1 = require("../lib/undoRedoStack");
const logger_1 = require("../lib/logger");
const telemetry_1 = require("../lib/telemetry");
const create = async (options) => {
    (0, logger_1.log)('Executing create command with options:' + JSON.stringify(options));
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
    (0, logger_1.log)(`\nCreating content with title: ${title}`);
    (0, logger_1.log)(`Content: ${content}`);
    (0, logger_1.log)('Content created successfully!');
    undoRedoStack_1.undoRedoStack.execute({ type: 'create', payload: { title, content } });
    (0, telemetry_1.trackEvent)('content_save', { type: 'create', title });
};
exports.create = create;
