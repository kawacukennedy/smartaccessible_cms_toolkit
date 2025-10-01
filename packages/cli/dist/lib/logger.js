"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logExample = exports.logOption = exports.logHeading = exports.logInfo = exports.logWarning = exports.logSuccess = exports.logError = exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
const log = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
};
exports.log = log;
const logError = (message, error) => {
    const timestamp = new Date().toISOString();
    console.error(chalk_1.default.red(`[${timestamp}] ✖ ERROR: ${message}`), error || '');
};
exports.logError = logError;
const logSuccess = (message) => {
    const timestamp = new Date().toISOString();
    console.log(chalk_1.default.green(`[${timestamp}] ✔ SUCCESS: ${message}`));
};
exports.logSuccess = logSuccess;
const logWarning = (message) => {
    const timestamp = new Date().toISOString();
    console.warn(chalk_1.default.yellow(`[${timestamp}] ⚠ WARNING: ${message}`));
};
exports.logWarning = logWarning;
const logInfo = (message) => {
    const timestamp = new Date().toISOString();
    console.info(chalk_1.default.blue(`[${timestamp}] ℹ INFO: ${message}`));
};
exports.logInfo = logInfo;
const logHeading = (message) => {
    console.log(chalk_1.default.bold(message.toUpperCase()));
};
exports.logHeading = logHeading;
const logOption = (option, description) => {
    console.log(`  - ${chalk_1.default.bold(option)}: ${description}`);
};
exports.logOption = logOption;
const logExample = (command) => {
    console.log(chalk_1.default.dim.italic(`  $ ${command}`));
};
exports.logExample = logExample;
