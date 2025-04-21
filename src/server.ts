import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
import { env } from './config/env';

const app = express();
const port = env.port;

// Configure CORS based on environment
const allowedOrigins = env.nodeEnv === 'production' 
  ? ['https://tatvaengineers.vercel.app'] // Your actual Vercel domain
  : ['http://localhost:5173', 'http://localhost:3000']; // Development origins

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${env.nodeEnv} mode`);
});

export default app;
