import { Command } from 'commander';
import { initCommand } from './commands/onboard';
import { createCommand } from './commands/create';
import { scanCommand } from './commands/ai-scan';
import { previewCommand } from './commands/preview';
import { deployCommand } from './commands/publish';
import { initializeTelemetry } from './lib/telemetry';

const program = new Command();

(async () => {
  await initializeTelemetry();

  program
    .name('smartcms')
    .version('1.0.0')
    .description('A CLI for the SmartAccessible CMS Toolkit');

  program.addCommand(initCommand);
  program.addCommand(createCommand);
  program.addCommand(scanCommand);
  program.addCommand(previewCommand);
  program.addCommand(deployCommand);

  program.parse(process.argv);
})();