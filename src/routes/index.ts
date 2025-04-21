import express from 'express';
import productRoutes from './productRoutes';
import inquiryRoutes from './inquiryRoutes';
import contactRoutes from './contactRoutes';
import serviceInquiryRoutes from './serviceInquiryRoutes';

const router = express.Router();

// Mount all product routes under /api/products
router.use('/products', productRoutes);

// (Other mounts—unchanged)
router.use('/inquiries', inquiryRoutes);
router.use('/contacts', contactRoutes);
router.use('/service-inquiries', serviceInquiryRoutes);

export default router;
