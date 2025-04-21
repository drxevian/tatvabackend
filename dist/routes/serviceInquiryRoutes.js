"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serviceInquiryApi_1 = require("../api/serviceInquiryApi");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const data = await serviceInquiryApi_1.serviceInquiryApiHandlers.getAllServiceInquiries();
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching service inquiries:', error);
        res.status(500).json({ error: 'Failed to fetch service inquiries' });
    }
});
router.post('/', async (req, res) => {
    try {
        const result = await serviceInquiryApi_1.serviceInquiryApiHandlers.addServiceInquiry(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating service inquiry:', error);
        res.status(500).json({ error: 'Failed to create service inquiry' });
    }
});
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        const updated = await serviceInquiryApi_1.serviceInquiryApiHandlers.updateServiceInquiryStatus(req.params.id, status);
        res.json(updated);
    }
    catch (error) {
        console.error('Error updating service inquiry status:', error);
        if (error.message === 'Invalid service inquiry ID') {
            res.status(400).json({ error: error.message });
        }
        else if (error.message === 'Service inquiry not found') {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Failed to update service inquiry status' });
        }
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const success = await serviceInquiryApi_1.serviceInquiryApiHandlers.deleteServiceInquiry(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Service inquiry not found' });
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting service inquiry:', error);
        if (error.message === 'Invalid service inquiry ID') {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Failed to delete service inquiry' });
        }
    }
});
exports.default = router;
