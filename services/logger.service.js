"use strict";
var Logger_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const tslib_1 = require("tslib");
const injectable_decorator_1 = require("../decorators/core/injectable.decorator");
const optional_decorator_1 = require("../decorators/core/optional.decorator");
const shared_utils_1 = require("../utils/shared.utils");
const color_cli_1 = require("../utils/color-cli");
const yellow = a => `\x1B[38;5;3m${a}\x1B[39m`; // xterm(3)
let Logger = Logger_1 = class Logger {
    constructor(context, isTimestampEnabled = false) {
        this.context = context;
        this.isTimestampEnabled = isTimestampEnabled;
    }
    error(message, trace = '', context) {
        const instance = this.getInstance();
        if (!this.isLogLevelEnabled('error')) {
            return;
        }
        instance &&
            instance.error.call(instance, message, trace, context || this.context);
    }
    log(message, context) {
        this.callFunction('log', message, context);
    }
    warn(message, context) {
        this.callFunction('warn', message, context);
    }
    debug(message, context) {
        this.callFunction('debug', message, context);
    }
    verbose(message, context) {
        this.callFunction('verbose', message, context);
    }
    setContext(context) {
        this.context = context;
    }
    static overrideLogger(logger) {
        if (Array.isArray(logger)) {
            this.logLevels = logger;
            return;
        }
        this.instance = shared_utils_1.isObject(logger) ? logger : undefined;
    }
    static log(message, context = '', isTimeDiffEnabled = true) {
        this.printMessage(message, color_cli_1.clc.green, context, isTimeDiffEnabled);
    }
    static error(message, trace = '', context = '', isTimeDiffEnabled = true) {
        this.printMessage(message, color_cli_1.clc.red, context, isTimeDiffEnabled);
        this.printStackTrace(trace);
    }
    static warn(message, context = '', isTimeDiffEnabled = true) {
        this.printMessage(message, color_cli_1.clc.yellow, context, isTimeDiffEnabled);
    }
    static debug(message, context = '', isTimeDiffEnabled = true) {
        this.printMessage(message, color_cli_1.clc.magentaBright, context, isTimeDiffEnabled);
    }
    static verbose(message, context = '', isTimeDiffEnabled = true) {
        this.printMessage(message, color_cli_1.clc.cyanBright, context, isTimeDiffEnabled);
    }
    callFunction(name, message, context) {
        if (!this.isLogLevelEnabled(name)) {
            return;
        }
        const instance = this.getInstance();
        const func = instance && instance[name];
        func &&
            func.call(instance, message, context || this.context, this.isTimestampEnabled);
    }
    getInstance() {
        const { instance } = Logger_1;
        return instance === this ? Logger_1 : instance;
    }
    isLogLevelEnabled(level) {
        return Logger_1.logLevels.includes(level);
    }
    static printMessage(message, color, context = '', isTimeDiffEnabled) {
        const output = shared_utils_1.isObject(message)
            ? `${color('Object:')}\n${JSON.stringify(message, null, 2)}\n`
            : color(message);
        const localeStringOptions = {
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            day: '2-digit',
            month: '2-digit',
        };
        const timestamp = new Date(Date.now()).toLocaleString(undefined, localeStringOptions);
        const pidMessage = color(`[Nest] ${process.pid}   - `);
        const contextMessage = context ? yellow(`[${context}] `) : '';
        const timestampDiff = this.updateAndGetTimestampDiff(isTimeDiffEnabled);
        process.stdout.write(`${pidMessage}${timestamp}   ${contextMessage}${output}${timestampDiff}\n`);
    }
    static updateAndGetTimestampDiff(isTimeDiffEnabled) {
        const includeTimestamp = Logger_1.lastTimestamp && isTimeDiffEnabled;
        const result = includeTimestamp
            ? yellow(` +${Date.now() - Logger_1.lastTimestamp}ms`)
            : '';
        Logger_1.lastTimestamp = Date.now();
        return result;
    }
    static printStackTrace(trace) {
        if (!trace) {
            return;
        }
        process.stdout.write(`${trace}\n`);
    }
};
Logger.logLevels = [
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
];
Logger.instance = Logger_1;
Logger = Logger_1 = tslib_1.__decorate([
    injectable_decorator_1.Injectable(),
    tslib_1.__param(0, optional_decorator_1.Optional()),
    tslib_1.__param(1, optional_decorator_1.Optional()),
    tslib_1.__metadata("design:paramtypes", [String, Object])
], Logger);
exports.Logger = Logger;
