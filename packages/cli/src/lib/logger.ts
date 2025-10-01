
import chalk from 'chalk';

export const log = (message: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

export const logError = (message: string, error?: any) => {
  const timestamp = new Date().toISOString();
  console.error(chalk.red(`[${timestamp}] ✖ ERROR: ${message}`), error || '');
};

export const logSuccess = (message: string) => {
  const timestamp = new Date().toISOString();
  console.log(chalk.green(`[${timestamp}] ✔ SUCCESS: ${message}`));
};

export const logWarning = (message: string) => {
  const timestamp = new Date().toISOString();
  console.warn(chalk.yellow(`[${timestamp}] ⚠ WARNING: ${message}`));
};

export const logInfo = (message: string) => {
  const timestamp = new Date().toISOString();
  console.info(chalk.blue(`[${timestamp}] ℹ INFO: ${message}`));
};

export const logHeading = (message: string) => {
  console.log(chalk.bold(message.toUpperCase()));
};

export const logOption = (option: string, description: string) => {
  console.log(`  - ${chalk.bold(option)}: ${description}`);
};

export const logExample = (command: string) => {
  console.log(chalk.dim.italic(`  $ ${command}`));
};
