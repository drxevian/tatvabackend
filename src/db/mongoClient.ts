import { MongoClient } from 'mongodb';
import { env } from '../config/env';

const uri = env.mongodbUri;
const client = new MongoClient(uri);
const clientPromise = client.connect().then(client => {
  console.log("Connected to MongoDB Atlas");
  return client;
});

export const getMongoClient = async () => {
  return await clientPromise;
};

export const getCollection = async (name: string) => {
  const client = await getMongoClient();
  return client.db('tatvaengineers').collection(name);
};
