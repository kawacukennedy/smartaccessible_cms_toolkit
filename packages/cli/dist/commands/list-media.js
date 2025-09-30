"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMediaCommand = void 0;
const commander_1 = require("commander");
const logger_1 = require("../lib/logger");
const dummyMedia = [
    { id: 1, name: 'image1.jpg', size: '1.2MB', created_at: '2025-09-26T10:00:00Z' },
    { id: 2, name: 'image2.png', size: '800KB', created_at: '2025-09-25T14:30:00Z' },
    { id: 3, name: 'document.pdf', size: '2.5MB', created_at: '2025-09-24T11:00:00Z' },
];
exports.listMediaCommand = new commander_1.Command()
    .command('list-media')
    .description('List all media assets')
    .action(() => {
    (0, logger_1.log)('Listing all media assets:\n');
    console.table(dummyMedia); // console.table is fine here as it's for structured data display
});
