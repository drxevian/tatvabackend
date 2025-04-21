import express from 'express';
import { contactApiHandlers } from '../api/contactApi';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await contactApiHandlers.getContactSubmissions();
    res.json(data);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await contactApiHandlers.addContactSubmission(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating contact submission:', error);
    res.status(500).json({ error: 'Failed to create contact submission' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const updated = await contactApiHandlers.updateContactSubmissionStatus(req.params.id, status);
    res.json(updated);
  } catch (error) {
    console.error('Error updating contact submission status:', error);
    if (error.message === 'Invalid contact submission ID') {
      res.status(400).json({ error: error.message });
    } else if (error.message === 'Contact submission not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update contact submission status' });
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await contactApiHandlers.deleteContactSubmission(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    if (error.message === 'Invalid contact submission ID') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete contact submission' });
    }
  }
});

export default router;