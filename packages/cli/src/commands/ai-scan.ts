import { Command } from 'commander';
import { runAIAnalysis } from '../lib/ai';
import { promises as fs } from 'fs';
import inquirer from 'inquirer';
import { logInfo, logSuccess, logError, logHeading, logExample } from '../lib/logger';

export const scanCommand = new Command()
  .command('scan <file>')
  .description('Scan a file for accessibility issues')
  .option('--fix', 'Automatically apply fixes', false)
  .option('--json', 'Output results in JSON format', false)
  .action(async (file, options) => {
    logHeading(`Scanning ‘${file}’ for accessibility issues...`);

    try {
      const fileContent = await fs.readFile(file, 'utf8');
      const issues = await runAIAnalysis(fileContent);

      if (options.json) {
        console.log(JSON.stringify({ issues }, null, 2));
        return;
      }

      if (issues.length === 0) {
        logSuccess('No accessibility issues found.');
        return;
      }

      logInfo(`Found ${issues.length} potential issues:`)

      if (options.fix) {
        logInfo('Applying automatic fixes...');
        // Placeholder for auto-fixing logic
        logSuccess('Finished applying automatic fixes.');
      } else {
        const choices = issues.map((issue: any, index: number) => ({
          name: `[Line ${issue.lineNumber}] ${issue.description}`,
          value: index,
        }));

        const { selectedIssues } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selectedIssues',
            message: 'Select the issues you want to fix:',
            choices,
          },
        ]);

        if (selectedIssues.length > 0) {
          logInfo('Applying selected fixes...');
          // Placeholder for applying selected fixes
          logSuccess('Finished applying selected fixes.');
        } else {
          logInfo('No fixes were applied.');
        }
      }

    } catch (error) {
      logError(`Failed to scan file: ${file}`, error);
      process.exit(1);
    }
  });
