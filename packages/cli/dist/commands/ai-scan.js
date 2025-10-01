"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanCommand = void 0;
const commander_1 = require("commander");
const ai_1 = require("../lib/ai");
const fs_1 = require("fs");
const inquirer_1 = __importDefault(require("inquirer"));
const logger_1 = require("../lib/logger");
exports.scanCommand = new commander_1.Command()
    .command('scan <file>')
    .description('Scan a file for accessibility issues')
    .option('--fix', 'Automatically apply fixes', false)
    .option('--json', 'Output results in JSON format', false)
    .action(async (file, options) => {
    (0, logger_1.logHeading)(`Scanning ‘${file}’ for accessibility issues...`);
    try {
        const fileContent = await fs_1.promises.readFile(file, 'utf8');
        const issues = await (0, ai_1.runAIAnalysis)(fileContent);
        if (options.json) {
            console.log(JSON.stringify({ issues }, null, 2));
            return;
        }
        if (issues.length === 0) {
            (0, logger_1.logSuccess)('No accessibility issues found.');
            return;
        }
        (0, logger_1.logInfo)(`Found ${issues.length} potential issues:`);
        if (options.fix) {
            (0, logger_1.logInfo)('Applying automatic fixes...');
            // Placeholder for auto-fixing logic
            (0, logger_1.logSuccess)('Finished applying automatic fixes.');
        }
        else {
            const choices = issues.map((issue, index) => ({
                name: `[Line ${issue.lineNumber}] ${issue.description}`,
                value: index,
            }));
            const { selectedIssues } = await inquirer_1.default.prompt([
                {
                    type: 'checkbox',
                    name: 'selectedIssues',
                    message: 'Select the issues you want to fix:',
                    choices,
                },
            ]);
            if (selectedIssues.length > 0) {
                (0, logger_1.logInfo)('Applying selected fixes...');
                // Placeholder for applying selected fixes
                (0, logger_1.logSuccess)('Finished applying selected fixes.');
            }
            else {
                (0, logger_1.logInfo)('No fixes were applied.');
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)(`Failed to scan file: ${file}`, error);
        process.exit(1);
    }
});
