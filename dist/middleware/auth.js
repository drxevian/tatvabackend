"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const verifyAdminToken = (req, res, next) => {
    console.log('Verifying admin token...');
    console.log('Cookies:', req.cookies);
    const token = req.cookies.adminToken;
    if (!token) {
        console.log('No admin token found in cookies');
        return res.status(401).json({ authenticated: false });
    }
    try {
        console.log('Verifying token with secret:', env_1.env.jwtSecret);
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        console.log('Token verified successfully:', decoded);
        req.admin = decoded;
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ authenticated: false });
    }
};
exports.verifyAdminToken = verifyAdminToken;
