import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
import { env } from './config/env';

const app = express();
const port = env.port;

// CORS configuration
const corsOptions = {
  origin: ['https://tatvaengineers.vercel.app', 'http://localhost:5173'], // Allow specific origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${env.nodeEnv} mode`);
});

export default app;
