"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productApiHandlers = void 0;
// src/api/productApi.ts
const mongodb_1 = require("mongodb");
const mongoClient_1 = require("../db/mongoClient");
const mapToProductWithId = (doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    category: doc.category,
    imageUrl: doc.imageUrl,
    images: doc.images || [],
    subproductImages: doc.subproductImages || {},
    isNew: doc.isNew || false,
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date()
});
exports.productApiHandlers = {
    /** Return all products */
    getAllProducts: async () => {
        const collection = await (0, mongoClient_1.getCollection)('products');
        const docs = await collection.find({}).toArray();
        return docs.map(mapToProductWithId);
    },
    /** Return one product or null */
    getProductById: async (id) => {
        const collection = await (0, mongoClient_1.getCollection)('products');
        const doc = await collection.findOne({ _id: new mongodb_1.ObjectId(id) });
        return doc ? mapToProductWithId(doc) : null;
    },
    /** Insert a new product */
    addProduct: async (input) => {
        const collection = await (0, mongoClient_1.getCollection)('products');
        const now = new Date();
        const productToInsert = Object.assign(Object.assign({}, input), { createdAt: now, updatedAt: now });
        const result = await collection.insertOne(productToInsert);
        const doc = await collection.findOne({ _id: result.insertedId });
        if (!doc)
            throw new Error('Failed to fetch newly created product');
        return mapToProductWithId(doc);
    },
    /** Update an existing product */
    updateProduct: async (id, data) => {
        try {
            console.log("🔄 Updating product in DB. ID:", id);
            console.log("📦 Update data:", data);
            const collection = await (0, mongoClient_1.getCollection)('products');
            // First check if the product exists
            const existingProduct = await collection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!existingProduct) {
                console.warn("⚠️ No product found with ID:", id);
                return null;
            }
            console.log("✅ Found existing product:", existingProduct);
            const updateData = {
                title: data.title,
                description: data.description,
                category: data.category,
                imageUrl: data.imageUrl,
                images: data.images || [],
                subproductImages: data.subproductImages || {},
                isNew: data.isNew || false,
                updatedAt: new Date()
            };
            console.log("📝 Update operation data:", updateData);
            const result = await collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
            if (!result) {
                console.error("❌ Failed to update product. Result:", result);
                return null;
            }
            console.log("✅ Successfully updated product:", result);
            return mapToProductWithId(result);
        }
        catch (error) {
            console.error("❌ Error updating product:", error);
            throw error;
        }
    },
    /** Delete one product */
    deleteProduct: async (id) => {
        const collection = await (0, mongoClient_1.getCollection)('products');
        const { deletedCount } = await collection.deleteOne({
            _id: new mongodb_1.ObjectId(id),
        });
        return deletedCount > 0;
    },
};
