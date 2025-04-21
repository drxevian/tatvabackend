"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productApi_1 = require("../api/productApi");
const router = express_1.default.Router();
// GET   /api/products
router.get('/', async (req, res) => {
    try {
        const products = await productApi_1.productApiHandlers.getAllProducts();
        res.json(products);
    }
    catch (err) {
        console.error('Failed to get products:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET   /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await productApi_1.productApiHandlers.getProductById(req.params.id);
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }
    catch (err) {
        console.error(`Failed to get product ${req.params.id}:`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST  /api/products
router.post('/', async (req, res) => {
    try {
        const newProduct = await productApi_1.productApiHandlers.addProduct(req.body);
        res.status(201).json(newProduct);
    }
    catch (err) {
        console.error('Failed to create product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// PUT   /api/products/:id
router.put('/:id', async (req, res) => {
    try {
        console.log("📥 PUT request received for product ID:", req.params.id);
        console.log("📦 Request body:", req.body);
        const updatedProduct = await productApi_1.productApiHandlers.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            console.warn("⚠️ Product not found or update failed for ID:", req.params.id);
            return res.status(404).json({
                error: 'Product not found or update failed',
                details: 'The product with the given ID does not exist or could not be updated'
            });
        }
        console.log("✅ Successfully updated product:", updatedProduct);
        res.json(updatedProduct);
    }
    catch (error) {
        console.error("❌ Error in PUT /api/products/:id:", error);
        res.status(500).json({
            error: 'Failed to update product',
            details: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    try {
        const success = await productApi_1.productApiHandlers.deleteProduct(req.params.id);
        res.json({ success });
    }
    catch (err) {
        console.error(`Failed to delete product ${req.params.id}:`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
