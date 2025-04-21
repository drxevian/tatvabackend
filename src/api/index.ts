import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection
const uri = "mongodb+srv://kush:Tatva_Engineers@tatvaengineers.boctzoi.mongodb.net/tatvaengineers?retryWrites=true&w=majority";
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

try {
  client = new MongoClient(uri);
  clientPromise = client.connect().then(client => {
    console.log("Connected to MongoDB Atlas");
    return client;
  });
} catch (error) {
  console.error("Failed to initialize MongoDB client:", error);
}

const getMongoClient = async (): Promise<MongoClient> => {
  if (!clientPromise) {
    throw new Error("MongoDB client not initialized");
  }
  try {
    return await clientPromise;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

const getCollection = async (collectionName: string) => {
  try {
    const client = await getMongoClient();
    return client.db('tatvaengineers').collection(collectionName);
  } catch (error) {
    console.error(`Error accessing collection ${collectionName}:`, error);
    throw error;
  }
};

export const productApiHandlers = {
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
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  },

  getProductById: async (id: string) => {
    try {
      const collection = await getCollection('products');
      const product = await collection.findOne({ _id: new ObjectId(id) });
      if (!product) return null;
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
    } catch (error) {
      console.error(`Error getting product with id ${id}:`, error);
      throw error;
    }
  },

  addProduct: async (product: any) => {
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
        id: insertedProduct?._id.toString(),
        title: insertedProduct?.title,
        description: insertedProduct?.description,
        category: insertedProduct?.category,
        imageUrl: insertedProduct?.imageUrl,
        images: insertedProduct?.images || [],
        subproductImages: insertedProduct?.subproductImages || {},
        isNew: insertedProduct?.isNew || false
      };
    } catch (error) {
      console.error("Error adding product:", error.message);
      throw error;
    }
  },

  updateProduct: async (id: string, product: any) => {
    try {
      const collection = await getCollection('products');
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: product },
        { returnDocument: 'after' }
      );
      const updated = result?.value;
      if (!updated) return null;

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
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const collection = await getCollection('products');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  }
};
