"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productApiHandlers = void 0;
const mongodb_1 = require("mongodb");
// MongoDB connection
const uri = "mongodb+srv://kush:Tatva_Engineers@tatvaengineers.boctzoi.mongodb.net/tatvaengineers?retryWrites=true&w=majority";
let client = null;
let clientPromise = null;
try {
    client = new mongodb_1.MongoClient(uri);
    clientPromise = client.connect().then(client => {
        console.log("Connected to MongoDB Atlas");
        return client;
    });
}
catch (error) {
    console.error("Failed to initialize MongoDB client:", error);
}
const getMongoClient = async () => {
    if (!clientPromise) {
        throw new Error("MongoDB client not initialized");
    }
    try {
        return await clientPromise;
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB");
    }
};
const getCollection = async (collectionName) => {
    try {
        const client = await getMongoClient();
        return client.db('tatvaengineers').collection(collectionName);
    }
    catch (error) {
        console.error(`Error accessing collection ${collectionName}:`, error);
        throw error;
    }
};
exports.productApiHandlers = {
    getAllProducts: async () => {
        try {
            const collection = await getCollection('products');
            const products = await collection.find({}).toArray();
            return products.map(doc => ({
                id: doc._id.toString(),
                title: doc.title,
                description: doc.description,
                category: doc.category,
                imageUrl: doc.imageUrl,
                images: doc.images || [],
                subproductImages: doc.subproductImages || {},
                isNew: doc.isNew || false
            }));
        }
        catch (error) {
            console.error("Error getting products:", error);
            throw error;
        }
    },
    getProductById: async (id) => {
        try {
            const collection = await getCollection('products');
            const product = await collection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!product)
                return null;
            return {
                id: product._id.toString(),
                title: product.title,
                description: product.description,
                category: product.category,
                imageUrl: product.imageUrl,
                images: product.images || [],
                subproductImages: product.subproductImages || {},
                isNew: product.isNew || false
            };
        }
        catch (error) {
            console.error(`Error getting product with id ${id}:`, error);
            throw error;
        }
    },
    addProduct: async (product) => {
        try {
            // ✅ Validation: Check required fields
            if (!product.title || !product.imageUrl || !product.category) {
                throw new Error("Missing required fields: title, imageUrl, or category");
            }
            console.log("Product received for insertion:", product); // DEBUG log
            const collection = await getCollection('products');
            const result = await collection.insertOne(product);
            const insertedProduct = await collection.findOne({ _id: result.insertedId });
            return {
                id: insertedProduct === null || insertedProduct === void 0 ? void 0 : insertedProduct._id.toString(),
                title: insertedProduct === null || insertedProduct === void 0 ? void 0 : insertedProduct.title,
                description: insertedProduct === null || insertedProduct === void 0 ? void 0 : insertedProduct.description,
                category: insertedProduct === null || insertedProduct === void 0 ? void 0 : insertedProduct.category,
                imageUrl: insertedProduct === null || insertedProduct === void 0 ? void 0 : insertedProduct.imageUrl,
                images: (insertedProduct === null || insertedProduct === void 0 ? void 0 : insertedProduct.images) || [],
                subproductImages: (insertedProduct === null || insertedProduct === void 0 ? void 0 : insertedProduct.subproductImages) || {},
                isNew: (insertedProduct === null || insertedProduct === void 0 ? void 0 : insertedProduct.isNew) || false
            };
        }
        catch (error) {
            console.error("Error adding product:", error.message);
            throw error;
        }
    },
    updateProduct: async (id, product) => {
        try {
            const collection = await getCollection('products');
            const result = await collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: product }, { returnDocument: 'after' });
            const updated = result === null || result === void 0 ? void 0 : result.value;
            if (!updated)
                return null;
            return {
                id: updated._id.toString(),
                title: updated.title,
                description: updated.description,
                category: updated.category,
                imageUrl: updated.imageUrl,
                images: updated.images || [],
                subproductImages: updated.subproductImages || {},
                isNew: updated.isNew || false
            };
        }
        catch (error) {
            console.error(`Error updating product with id ${id}:`, error);
            throw error;
        }
    },
    deleteProduct: async (id) => {
        try {
            const collection = await getCollection('products');
            const result = await collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount > 0;
        }
        catch (error) {
            console.error(`Error deleting product with id ${id}:`, error);
            throw error;
        }
    }
};
