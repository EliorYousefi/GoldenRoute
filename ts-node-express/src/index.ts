import express from 'express';
import planeRoutes from './routes/planeRoute';
import dotenv from 'dotenv';
import cors from 'cors';
import locationRoutes from './routes/locationRoute';

dotenv.config();

const app = express();
const port = process.env.PORT || 4100; // Default to port 4100 if PORT is not defined

// Enable CORS for all origins 
app.use(cors());

app.use(express.json());

// Log request URLs
app.use('/api', (req, res, next) => {
  console.log(`Request URL: ${req.originalUrl}`);
  next();
});

// Use routes
app.use('/api', planeRoutes);
app.use('/api', locationRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
