"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redoCommand = void 0;
const commander_1 = require("commander");
const undoRedoStack_1 = require("../lib/undoRedoStack");
const logger_1 = require("../lib/logger");
const telemetry_1 = require("../lib/telemetry");
exports.redoCommand = new commander_1.Command()
    .command('redo')
    .description('Redo the last undone action')
    .action(() => {
    const redoneAction = undoRedoStack_1.undoRedoStack.redo();
    if (redoneAction) {
        (0, logger_1.log)('Action redone');
        (0, telemetry_1.trackEvent)('redo', { actionType: redoneAction.type });
    }
    else {
        (0, logger_1.log)('No action to redo.');
    }
});
