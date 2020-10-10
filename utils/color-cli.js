"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clc = void 0;
exports.clc = {
    green: a => `\x1B[32m${a}\x1B[39m`,
    yellow: a => `\x1B[33m${a}\x1B[39m`,
    red: a => `\x1B[31m${a}\x1B[39m`,
    magentaBright: a => `\x1B[95m${a}\x1B[39m`,
    cyanBright: a => `\x1B[96m${a}\x1B[39m`,
};
