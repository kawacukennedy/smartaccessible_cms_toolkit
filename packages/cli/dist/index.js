"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const onboard_1 = require("./commands/onboard");
const create_1 = require("./commands/create");
const ai_scan_1 = require("./commands/ai-scan");
const preview_1 = require("./commands/preview");
const publish_1 = require("./commands/publish");
const telemetry_1 = require("./lib/telemetry");
const program = new commander_1.Command();
(async () => {
    await (0, telemetry_1.initializeTelemetry)();
    program
        .name('smartcms')
        .version('1.0.0')
        .description('A CLI for the SmartAccessible CMS Toolkit');
    program.addCommand(onboard_1.initCommand);
    program.addCommand(create_1.createCommand);
    program.addCommand(ai_scan_1.scanCommand);
    program.addCommand(preview_1.previewCommand);
    program.addCommand(publish_1.deployCommand);
    program.parse(process.argv);
})();
