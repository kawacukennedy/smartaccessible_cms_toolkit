
import { Command } from 'commander';
import { log } from '../lib/logger';

const dummyMedia = [
  { id: 1, name: 'image1.jpg', size: '1.2MB', created_at: '2025-09-26T10:00:00Z' },
  { id: 2, name: 'image2.png', size: '800KB', created_at: '2025-09-25T14:30:00Z' },
  { id: 3, name: 'document.pdf', size: '2.5MB', created_at: '2025-09-24T11:00:00Z' },
];

export const listMediaCommand = new Command()
  .command('list-media')
  .description('List all media assets')
  .action(() => {
    log('Listing all media assets:\n');
    console.table(dummyMedia); // console.table is fine here as it's for structured data display
  });

