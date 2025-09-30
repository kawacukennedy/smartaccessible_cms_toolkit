"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.log = void 0;
const log = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
};
exports.log = log;
const logError = (message, error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`, error);
};
exports.logError = logError;
