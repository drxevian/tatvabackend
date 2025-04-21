"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceInquiryApiHandlers = void 0;
const mongodb_1 = require("mongodb");
const mongoClient_1 = require("../db/mongoClient");
const convertToFrontendFormat = (doc) => {
    if (!doc)
        return null;
    return Object.assign(Object.assign({}, doc), { id: doc._id.toString(), _id: undefined });
};
exports.serviceInquiryApiHandlers = {
    getAllServiceInquiries: async () => {
        const collection = await (0, mongoClient_1.getCollection)('service-inquiries');
        const inquiries = await collection.find({}).toArray();
        return inquiries.map(convertToFrontendFormat);
    },
    addServiceInquiry: async (inquiry) => {
        const collection = await (0, mongoClient_1.getCollection)('service-inquiries');
        const result = await collection.insertOne(Object.assign(Object.assign({}, inquiry), { date: new Date().toISOString(), status: "new" }));
        const newInquiry = await collection.findOne({ _id: result.insertedId });
        return convertToFrontendFormat(newInquiry);
    },
    updateServiceInquiryStatus: async (id, status) => {
        try {
            console.log('Updating service inquiry status:', { id, status });
            if (!mongodb_1.ObjectId.isValid(id)) {
                console.error('Invalid service inquiry ID:', id);
                throw new Error('Invalid service inquiry ID');
            }
            const objectId = new mongodb_1.ObjectId(id);
            const collection = await (0, mongoClient_1.getCollection)('service-inquiries');
            // First check if the document exists
            const existingDoc = await collection.findOne({ _id: objectId });
            if (!existingDoc) {
                console.error('Service inquiry not found with ID:', id);
                throw new Error('Service inquiry not found');
            }
            // Update the document
            const updateResult = await collection.updateOne({ _id: objectId }, { $set: { status } });
            if (updateResult.modifiedCount === 0) {
                console.error('Failed to update service inquiry:', id);
                throw new Error('Failed to update service inquiry');
            }
            // Get the updated document
            const updatedDoc = await collection.findOne({ _id: objectId });
            if (!updatedDoc) {
                console.error('Failed to fetch updated service inquiry:', id);
                throw new Error('Failed to fetch updated service inquiry');
            }
            return convertToFrontendFormat(updatedDoc);
        }
        catch (error) {
            console.error('Error updating service inquiry status:', error);
            throw error;
        }
    },
    deleteServiceInquiry: async (id) => {
        try {
            if (!mongodb_1.ObjectId.isValid(id)) {
                throw new Error('Invalid service inquiry ID');
            }
            const collection = await (0, mongoClient_1.getCollection)('service-inquiries');
            const result = await collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount > 0;
        }
        catch (error) {
            console.error('Error deleting service inquiry:', error);
            throw error;
        }
    }
};
