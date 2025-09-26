import { Command } from 'commander';
import { runAIAnalysis } from '../lib/ai';
import { promises as fs } from 'fs';
import path from 'path';

export const aiScanCommand = new Command()
  .command('ai-scan')
  .description('Run an AI scan on a piece of content')
  .requiredOption('--id <id>', 'The ID of the content to scan')
  .action(async (options) => {
    console.log(`Running AI scan for content ID: ${options.id}`);

    try {
      // 1. Fetch content (simulated from project.json)
      console.log('Fetching content...');
      const projectJsonPath = path.join(process.cwd(), '..' ,'..' ,'project.json');
      const fileContents = await fs.readFile(projectJsonPath, 'utf8');
      const projectData = JSON.parse(fileContents);
      const contentBlock = projectData.mock_data.ContentBlock.sample;

      // 2. Run AI analysis
      console.log('Running AI analysis...');
      const issues = await runAIAnalysis(contentBlock.content);

      // 3. Display results
      console.log('\nAI Scan Results:');
      if (issues.length === 0) {
        console.log('No issues found.');
      } else {
        issues.forEach((issue: any, index: number) => {
          console.log(`\nIssue ${index + 1}:`);
          console.log(`  - Description: ${issue.description}`);
          console.log(`  - Severity: ${issue.severity}`);
          console.log(`  - Recommendation: ${issue.recommendation}`);
        });
      }
    } catch (error) {
      console.error('Error during AI scan:', error);
      process.exit(1);
    }
  });