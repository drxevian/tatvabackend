"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.env = {
    port: process.env.PORT || 5000,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tatva-engineers',
};
