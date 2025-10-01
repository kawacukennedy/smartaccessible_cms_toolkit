"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = void 0;
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const logger_1 = require("../lib/logger");
const fs = __importStar(require("fs"));
exports.initCommand = new commander_1.Command()
    .command('init')
    .description('Initialize project with Storyblok connection')
    .option('--space-id <id>', 'Your Storyblok space ID')
    .option('--token <access_token>', 'Your Storyblok access token')
    .option('--config <file>', 'Path to save configuration', '.smartcmsrc')
    .action(async (options) => {
    (0, logger_1.logHeading)('Initializing SmartAccessible CMS Project');
    const questions = [
        {
            type: 'input',
            name: 'spaceId',
            message: 'Enter your Storyblok space ID:',
            when: !options.spaceId,
        },
        {
            type: 'password',
            name: 'token',
            message: 'Enter your Storyblok access token:',
            when: !options.token,
        },
    ];
    const answers = await inquirer_1.default.prompt(questions);
    const config = {
        spaceId: options.spaceId || answers.spaceId,
        token: options.token || answers.token,
    };
    if (!config.spaceId || !config.token) {
        (0, logger_1.logError)('Storyblok space ID and access token are required.');
        return;
    }
    try {
        fs.writeFileSync(options.config, JSON.stringify(config, null, 2));
        (0, logger_1.logSuccess)(`Configuration saved to ${options.config}`);
        (0, logger_1.logInfo)('Your project is now connected to Storyblok.');
    }
    catch (error) {
        (0, logger_1.logError)('Failed to save configuration file.', error);
    }
});
