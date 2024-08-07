import express from 'express';
import planeRoutes from './routes/planeRoute';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

// Use routes
app.use('/api', planeRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
