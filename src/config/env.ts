
import { config } from 'dotenv';
config();

export const env = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tatva-engineers',
};
