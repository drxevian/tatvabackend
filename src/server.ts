import express from 'express';
import cors from 'cors';
import apiRoutes from './routes';
import { env } from './config/env';

const app = express();
const port = env.port;

// Configure CORS with credentials
app.use(cors({
  origin: 'https://tatvaengineers.vercel.app',
  credentials: true
}));

app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
