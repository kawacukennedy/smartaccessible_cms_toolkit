"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditAccessibility = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const ai_1 = require("../lib/ai");
const auditAccessibility = async (options) => {
    console.log('Running accessibility audit with options:', options);
    try {
        // 1. Fetch content (from project.json)
        console.log('Fetching content...');
        const projectJsonPath = path_1.default.join(process.cwd(), '..', '..', 'project.json');
        const fileContents = await fs_1.promises.readFile(projectJsonPath, 'utf8');
        const projectData = JSON.parse(fileContents);
        const contentBlock = projectData.mock_data.ContentBlock.sample;
        // 2. Run AI analysis
        let issues = [];
        if (options.includeAiSuggestions) {
            console.log('Running AI analysis...');
            issues = await (0, ai_1.runAIAnalysis)(contentBlock.content);
        }
        // 3. Generate report
        console.log('Generating report...');
        const report = {
            space: options.space,
            locale: options.locale,
            timestamp: new Date().toISOString(),
            results: {
                contentBlockId: contentBlock.id,
                issues,
            },
        };
        // 4. Write report to file
        const outputPath = path_1.default.resolve(options.outputFile);
        await fs_1.promises.writeFile(outputPath, JSON.stringify(report, null, 2));
        console.log(`Report successfully saved to ${outputPath}`);
        // 5. Send email (simulation)
        console.log('Simulating sending email report...');
    }
    catch (error) {
        console.error('Error during accessibility audit:', error);
        // 6. Log errors
        console.log('Simulating logging errors...');
        process.exit(1);
    }
};
exports.auditAccessibility = auditAccessibility;
