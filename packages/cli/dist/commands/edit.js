"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.edit = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const undoRedoStack_1 = require("../lib/undoRedoStack");
const logger_1 = require("../lib/logger");
const telemetry_1 = require("../lib/telemetry");
const edit = async (contentId, options) => {
    (0, logger_1.log)(`Executing edit command for content ID: ${contentId} with options:` + JSON.stringify(options));
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'field',
            message: 'Enter the field to edit:',
            when: !options.field,
        },
        {
            type: 'editor',
            name: 'value',
            message: 'Enter the new value:',
            when: !options.value,
        },
    ]);
    const field = options.field || answers.field;
    const value = options.value || answers.value;
    // Placeholder for edit logic
    (0, logger_1.log)(`\nEditing field: ${field}`);
    (0, logger_1.log)(`New value: ${value}`);
    (0, logger_1.log)('Content edited successfully!');
    undoRedoStack_1.undoRedoStack.execute({ type: 'edit', payload: { contentId, field, value } });
    (0, telemetry_1.trackEvent)('content_save', { type: 'edit', contentId, field });
};
exports.edit = edit;
