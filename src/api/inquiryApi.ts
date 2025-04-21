import { ObjectId } from 'mongodb';
import { getCollection } from '../db/mongoClient';

const convertToFrontendFormat = (doc: any) => {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    subject: doc.subject || doc.productRequirement || "Product Inquiry", // Fallback for older entries
    message: doc.message || doc.additionalInfo || "", // Fallback for older entries
    productId: doc.productId,
    subproductName: doc.subproductName,
    status: doc.status || "new",
    date: doc.date || new Date().toISOString(),
    _id: undefined
  };
};

export const inquiryApiHandlers = {
  getAllInquiries: async () => {
    const collection = await getCollection('inquiries');
    const inquiries = await collection.find({}).toArray();
    return inquiries.map(convertToFrontendFormat);
  },
  addInquiry: async (inquiry: any) => {
    const collection = await getCollection('inquiries');
    const result = await collection.insertOne(inquiry);
    const newInquiry = await collection.findOne({ _id: result.insertedId });
    return convertToFrontendFormat(newInquiry);
  },
  updateInquiryStatus: async (id: string, status: string) => {
    try {
      console.log('Updating inquiry status:', { id, status });
      
      if (!ObjectId.isValid(id)) {
        console.error('Invalid inquiry ID:', id);
        throw new Error('Invalid inquiry ID');
      }
      
      const objectId = new ObjectId(id);
      const collection = await getCollection('inquiries');
      
      // First check if the document exists
      const existingDoc = await collection.findOne({ _id: objectId });
      if (!existingDoc) {
        console.error('Inquiry not found with ID:', id);
        throw new Error('Inquiry not found');
      }
      
      // Update the document
      const updateResult = await collection.updateOne(
        { _id: objectId },
        { $set: { status } }
      );
      
      if (updateResult.modifiedCount === 0) {
        console.error('Failed to update inquiry:', id);
        throw new Error('Failed to update inquiry');
      }
      
      // Get the updated document
      const updatedDoc = await collection.findOne({ _id: objectId });
      if (!updatedDoc) {
        console.error('Failed to fetch updated inquiry:', id);
        throw new Error('Failed to fetch updated inquiry');
      }
      
      return convertToFrontendFormat(updatedDoc);
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      throw error;
    }
  },
  deleteInquiry: async (id: string) => {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid inquiry ID');
      }
      
      const collection = await getCollection('inquiries');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      throw error;
    }
  }
};