"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackEvent = exports.initializeTelemetry = void 0;
const logger_1 = require("./logger");
const inquirer_1 = __importDefault(require("inquirer"));
let telemetryEnabled = null;
const initializeTelemetry = async () => {
    // In a real application, this would involve checking a config file or user preferences
    // For now, we'll simulate asking for consent once.
    if (telemetryEnabled === null) {
        const { consent } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'consent',
                message: 'Do you agree to send anonymous usage data to help improve the CLI? (Privacy Policy: [link to policy])',
                default: false,
            },
        ]);
        telemetryEnabled = consent;
        if (telemetryEnabled) {
            (0, logger_1.log)('Anonymous telemetry enabled. Thank you!');
        }
        else {
            (0, logger_1.log)('Anonymous telemetry disabled.');
        }
    }
};
exports.initializeTelemetry = initializeTelemetry;
const trackEvent = (eventName, properties) => {
    if (telemetryEnabled) {
        (0, logger_1.log)(`Tracking event: ${eventName}` + (properties ? ` with properties: ${JSON.stringify(properties)}` : ''));
        // In a real application, this would send data to a telemetry service
    }
    else {
        // log(`Telemetry disabled, not tracking event: ${eventName}`);
    }
};
exports.trackEvent = trackEvent;
