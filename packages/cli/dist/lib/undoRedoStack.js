"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undoRedoStack = void 0;
class UndoRedoStack {
    constructor(maxSize = 200) {
        this.history = [];
        this.future = [];
        this.maxSize = maxSize;
    }
    execute(action) {
        this.history.push(action);
        if (this.history.length > this.maxSize) {
            this.history.shift(); // Remove the oldest action if stack exceeds max size
        }
        this.future = []; // Clear future when a new action is executed
    }
    undo() {
        const action = this.history.pop();
        if (action) {
            this.future.push(action);
        }
        return action;
    }
    redo() {
        const action = this.future.pop();
        if (action) {
            this.history.push(action);
        }
        return action;
    }
    clear() {
        this.history = [];
        this.future = [];
    }
    getHistory() {
        return this.history;
    }
    getFuture() {
        return this.future;
    }
}
exports.undoRedoStack = new UndoRedoStack();
