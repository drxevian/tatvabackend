import express from 'express';
import { serviceInquiryApiHandlers } from '../api/serviceInquiryApi';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await serviceInquiryApiHandlers.getAllServiceInquiries();
    res.json(data);
  } catch (error) {
    console.error('Error fetching service inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch service inquiries' });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await serviceInquiryApiHandlers.addServiceInquiry(req.body);
    res.status(201).json(result);
  } catch (error) {
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
    
    const updated = await serviceInquiryApiHandlers.updateServiceInquiryStatus(req.params.id, status);
    res.json(updated);
  } catch (error) {
    console.error('Error updating service inquiry status:', error);
    if (error.message === 'Invalid service inquiry ID') {
      res.status(400).json({ error: error.message });
    } else if (error.message === 'Service inquiry not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update service inquiry status' });
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await serviceInquiryApiHandlers.deleteServiceInquiry(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Service inquiry not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service inquiry:', error);
    if (error.message === 'Invalid service inquiry ID') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete service inquiry' });
    }
  }
});

export default router; 