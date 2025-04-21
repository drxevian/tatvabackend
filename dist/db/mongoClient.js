"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = exports.getMongoClient = void 0;
const mongodb_1 = require("mongodb");
const env_1 = require("../config/env");
const uri = env_1.env.mongodbUri;
const client = new mongodb_1.MongoClient(uri);
const clientPromise = client.connect().then(client => {
    console.log("Connected to MongoDB Atlas");
    return client;
});
const getMongoClient = async () => {
    return await clientPromise;
};
exports.getMongoClient = getMongoClient;
const getCollection = async (name) => {
    const client = await (0, exports.getMongoClient)();
    return client.db('tatvaengineers').collection(name);
};
exports.getCollection = getCollection;
