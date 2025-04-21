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

export const contactApiHandlers = {
  getContactSubmissions: async () => {
    const collection = await getCollection('contacts');
    const submissions = await collection.find({}).toArray();
    return submissions.map(convertToFrontendFormat);
  },
  addContactSubmission: async (contact: any) => {
    const collection = await getCollection('contacts');
    const result = await collection.insertOne(contact);
    const newSubmission = await collection.findOne({ _id: result.insertedId });
    return convertToFrontendFormat(newSubmission);
  },
  updateContactSubmissionStatus: async (id: string, status: string) => {
    try {
      console.log('Updating contact submission status:', { id, status });
      
      if (!ObjectId.isValid(id)) {
        console.error('Invalid contact submission ID:', id);
        throw new Error('Invalid contact submission ID');
      }
      
      const objectId = new ObjectId(id);
      const collection = await getCollection('contacts');
      
      // First check if the document exists
      const existingDoc = await collection.findOne({ _id: objectId });
      if (!existingDoc) {
        console.error('Contact submission not found with ID:', id);
        throw new Error('Contact submission not found');
      }
      
      // Update the document
      const updateResult = await collection.updateOne(
        { _id: objectId },
        { $set: { status } }
      );
      
      if (updateResult.modifiedCount === 0) {
        console.error('Failed to update contact submission:', id);
        throw new Error('Failed to update contact submission');
      }
      
      // Get the updated document
      const updatedDoc = await collection.findOne({ _id: objectId });
      if (!updatedDoc) {
        console.error('Failed to fetch updated contact submission:', id);
        throw new Error('Failed to fetch updated contact submission');
      }
      
      return convertToFrontendFormat(updatedDoc);
    } catch (error) {
      console.error('Error updating contact submission status:', error);
      throw error;
    }
  },
  deleteContactSubmission: async (id: string) => {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid contact submission ID');
      }
      
      const collection = await getCollection('contacts');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting contact submission:', error);
      throw error;
    }
  }
};
