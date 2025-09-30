"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undoCommand = void 0;
const commander_1 = require("commander");
const undoRedoStack_1 = require("../lib/undoRedoStack");
const logger_1 = require("../lib/logger");
const telemetry_1 = require("../lib/telemetry");
exports.undoCommand = new commander_1.Command()
    .command('undo')
    .description('Undo the last action')
    .action(() => {
    const undoneAction = undoRedoStack_1.undoRedoStack.undo();
    if (undoneAction) {
        (0, logger_1.log)('Action undone');
        (0, telemetry_1.trackEvent)('undo', { actionType: undoneAction.type });
    }
    else {
        (0, logger_1.log)('No action to undo.');
    }
});
