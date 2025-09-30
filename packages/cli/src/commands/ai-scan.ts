import { Command } from 'commander';
import { runAIAnalysis } from '../lib/ai';
import { promises as fs } from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { undoRedoStack } from '../lib/undoRedoStack';
import { log, logError } from '../lib/logger';
import { trackEvent } from '../lib/telemetry';

export const aiScanCommand = new Command()
  .command('ai-scan')
  .description('Run an AI scan on a piece of content')
  .requiredOption('--id <id>', 'The ID of the content to scan')
  .action(async (options) => {
    log(`Running AI scan for content ID: ${options.id}`);

    try {
      // 1. Fetch content (simulated from project.json)
      log('Fetching content...');
      const projectJsonPath = path.join(process.cwd(), '..' ,'..' ,'project.json');
      const fileContents = await fs.readFile(projectJsonPath, 'utf8');
      const projectData = JSON.parse(fileContents);
      const contentBlock = projectData.mock_data.ContentBlock.sample;

      // 2. Run AI analysis
      log('Running AI analysis...');
      const issues = await runAIAnalysis(contentBlock.content);

      // 3. Display results
      log('AI suggestions ready');
      if (issues.length === 0) {
        log('No issues found.');
      } else {
        const choices = issues.map((issue: any, index: number) => ({
          name: `Issue ${index + 1}: ${issue.description}`,
          value: index,
        }));

        const { selectedIssues } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selectedIssues',
            message: 'Select the issues you want to apply:',
            choices,
          },
        ]);

        if (selectedIssues.length > 0) {
          log('Applying selected AI suggestions...');
          const selectedSuggestions = selectedIssues.map((index: number) => issues[index]);
          undoRedoStack.execute({ type: 'apply-ai-suggestions', payload: { contentId: options.id, suggestions: selectedSuggestions } });
          log('AI suggestions applied.');
          trackEvent('ai_applied', { contentId: options.id, suggestionsCount: selectedSuggestions.length });
        } else {
          log('No AI suggestions were applied.');
        }
      }
    } catch (error) {
      logError('Error during AI scan:', error);
      process.exit(1);
    }
  });