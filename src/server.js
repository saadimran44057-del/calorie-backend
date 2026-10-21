import express from 'express';
import cors from 'cors';
import { sequelize } from './config/db.js';
import entryRoutes from './routes/entries.js';
import goalRoutes from './routes/goals.js';

const app = express();

app.use(cors());          // allow the app to call this API
app.use(express.json());  // read JSON from request bodies

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/entries', entryRoutes);
app.use('/api/goals', goalRoutes);

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await sequelize.authenticate(); // check the database connection
    await sequelize.sync();         // create tables if they don't exist
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Startup error:', e.message);
    process.exit(1);
  }
};

start();