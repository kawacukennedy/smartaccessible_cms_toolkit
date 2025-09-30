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
exports.aiScanCommand = new commander_1.Command()
    .command('ai-scan')
    .description('Run an AI scan on a piece of content')
    .requiredOption('--id <id>', 'The ID of the content to scan')
    .action(async (options) => {
    console.log(`Running AI scan for content ID: ${options.id}`);
    try {
        // 1. Fetch content (simulated from project.json)
        console.log('Fetching content...');
        const projectJsonPath = path_1.default.join(process.cwd(), '..', '..', 'project.json');
        const fileContents = await fs_1.promises.readFile(projectJsonPath, 'utf8');
        const projectData = JSON.parse(fileContents);
        const contentBlock = projectData.mock_data.ContentBlock.sample;
        // 2. Run AI analysis
        console.log('Running AI analysis...');
        const issues = await (0, ai_1.runAIAnalysis)(contentBlock.content);
        // 3. Display results
        console.log('\nAI Scan Results:');
        if (issues.length === 0) {
            console.log('No issues found.');
        }
        else {
            issues.forEach((issue, index) => {
                console.log(`\nIssue ${index + 1}:`);
                console.log(`  - Description: ${issue.description}`);
                console.log(`  - Severity: ${issue.severity}`);
                console.log(`  - Recommendation: ${issue.recommendation}`);
            });
        }
    }
    catch (error) {
        console.error('Error during AI scan:', error);
        process.exit(1);
    }
});
