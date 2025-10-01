"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveConflictsCommand = void 0;
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const logger_1 = require("../lib/logger");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
exports.resolveConflictsCommand = new commander_1.Command()
    .command('resolve-conflicts')
    .description('Resolve content conflicts between local and server versions')
    .requiredOption('--id <id>', 'The ID of the content to resolve')
    .action(async (options) => {
    (0, logger_1.log)(`Resolving conflicts for content ID: ${options.id}`);
    try {
        // 1. Fetch conflicting content (simulated)
        (0, logger_1.log)('Fetching conflicting content...');
        const projectJsonPath = path_1.default.join(process.cwd(), '..', '..', 'project.json');
        const fileContents = await fs_1.promises.readFile(projectJsonPath, 'utf8');
        const projectData = JSON.parse(fileContents);
        const localContent = projectData.mock_data.ContentBlock.sample.content;
        const serverContent = localContent.replace('introduction', 'INTRODUCTION');
        // 2. Present the two versions to the user
        (0, logger_1.log)('\nLocal Version:');
        (0, logger_1.log)(localContent);
        (0, logger_1.log)('\nServer Version:');
        (0, logger_1.log)(serverContent);
        // 3. Ask the user to manually merge the content
        const { resolvedContent } = await inquirer_1.default.prompt([
            {
                type: 'editor',
                name: 'resolvedContent',
                message: 'Please merge the content manually:',
                default: `${localContent}\n---MERGED---\n${serverContent}`,
            },
        ]);
        // 4. Save the merged content (simulated)
        (0, logger_1.log)('Saving merged content...');
        (0, logger_1.log)('Merged content saved successfully.');
    }
    catch (error) {
        (0, logger_1.logError)('Error during conflict resolution:', error);
        process.exit(1);
    }
});
