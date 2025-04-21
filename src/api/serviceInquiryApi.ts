import { ObjectId } from 'mongodb';
import { getCollection } from '../db/mongoClient';

const convertToFrontendFormat = (doc: any) => {
  if (!doc) return null;
  return {
    ...doc,
    id: doc._id.toString(),
    _id: undefined
  };
};

export const serviceInquiryApiHandlers = {
  getAllServiceInquiries: async () => {
    const collection = await getCollection('service-inquiries');
    const inquiries = await collection.find({}).toArray();
    return inquiries.map(convertToFrontendFormat);
  },

  addServiceInquiry: async (inquiry: any) => {
    const collection = await getCollection('service-inquiries');
    const result = await collection.insertOne({
      ...inquiry,
      date: new Date().toISOString(),
      status: "new"
    });
    const newInquiry = await collection.findOne({ _id: result.insertedId });
    return convertToFrontendFormat(newInquiry);
  },

  updateServiceInquiryStatus: async (id: string, status: string) => {
    try {
      console.log('Updating service inquiry status:', { id, status });
      
      if (!ObjectId.isValid(id)) {
        console.error('Invalid service inquiry ID:', id);
        throw new Error('Invalid service inquiry ID');
      }
      
      const objectId = new ObjectId(id);
      const collection = await getCollection('service-inquiries');
      
      // First check if the document exists
      const existingDoc = await collection.findOne({ _id: objectId });
      if (!existingDoc) {
        console.error('Service inquiry not found with ID:', id);
        throw new Error('Service inquiry not found');
      }
      
      // Update the document
      const updateResult = await collection.updateOne(
        { _id: objectId },
        { $set: { status } }
      );
      
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
    } catch (error) {
      console.error('Error updating service inquiry status:', error);
      throw error;
    }
  },

  deleteServiceInquiry: async (id: string) => {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid service inquiry ID');
      }
      
      const collection = await getCollection('service-inquiries');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting service inquiry:', error);
      throw error;
    }
  }
}; 