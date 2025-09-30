"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiScanCommand = void 0;
const commander_1 = require("commander");
const ai_1 = require("../lib/ai");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const undoRedoStack_1 = require("../lib/undoRedoStack");
const logger_1 = require("../lib/logger");
const telemetry_1 = require("../lib/telemetry");
exports.aiScanCommand = new commander_1.Command()
    .command('ai-scan')
    .description('Run an AI scan on a piece of content')
    .requiredOption('--id <id>', 'The ID of the content to scan')
    .action(async (options) => {
    (0, logger_1.log)(`Running AI scan for content ID: ${options.id}`);
    try {
        // 1. Fetch content (simulated from project.json)
        (0, logger_1.log)('Fetching content...');
        const projectJsonPath = path_1.default.join(process.cwd(), '..', '..', 'project.json');
        const fileContents = await fs_1.promises.readFile(projectJsonPath, 'utf8');
        const projectData = JSON.parse(fileContents);
        const contentBlock = projectData.mock_data.ContentBlock.sample;
        // 2. Run AI analysis
        (0, logger_1.log)('Running AI analysis...');
        const issues = await (0, ai_1.runAIAnalysis)(contentBlock.content);
        // 3. Display results
        (0, logger_1.log)('AI suggestions ready');
        if (issues.length === 0) {
            (0, logger_1.log)('No issues found.');
        }
        else {
            issues.forEach((issue, index) => {
                (0, logger_1.log)(`\nIssue ${index + 1}:`);
                (0, logger_1.log)(`  - Description: ${issue.description}`);
                (0, logger_1.log)(`  - Severity: ${issue.severity}`);
                (0, logger_1.log)(`  - Recommendation: ${issue.recommendation}`);
            });
            const { applySuggestions } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'applySuggestions',
                    message: 'Do you want to apply these AI suggestions?',
                    default: false,
                },
            ]);
            if (applySuggestions) {
                (0, logger_1.log)('Applying AI suggestions...');
                // Simulate applying suggestions
                undoRedoStack_1.undoRedoStack.execute({ type: 'apply-ai-suggestions', payload: { contentId: options.id, suggestions: issues } });
                (0, logger_1.log)('AI suggestions applied.');
                (0, telemetry_1.trackEvent)('ai_applied', { contentId: options.id, suggestionsCount: issues.length });
            }
            else {
                (0, logger_1.log)('AI suggestions rejected.');
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)('Error during AI scan:', error);
        process.exit(1);
    }
});
