"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inquiryApi_1 = require("../api/inquiryApi");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const data = await inquiryApi_1.inquiryApiHandlers.getAllInquiries();
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});
router.post('/', async (req, res) => {
    try {
        const result = await inquiryApi_1.inquiryApiHandlers.addInquiry(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({ error: 'Failed to create inquiry' });
    }
});
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        const updated = await inquiryApi_1.inquiryApiHandlers.updateInquiryStatus(req.params.id, status);
        res.json(updated);
    }
    catch (error) {
        console.error('Error updating inquiry status:', error);
        if (error.message === 'Invalid inquiry ID') {
            res.status(400).json({ error: error.message });
        }
        else if (error.message === 'Inquiry not found') {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Failed to update inquiry status' });
        }
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const success = await inquiryApi_1.inquiryApiHandlers.deleteInquiry(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting inquiry:', error);
        if (error.message === 'Invalid inquiry ID') {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Failed to delete inquiry' });
        }
    }
});
exports.default = router;
