import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { config } from './src/config/index.js';
import { errorHandler } from './src/middleware/errorHandler.js';

import authRoutes from './src/routes/auth.routes.js';
import farmRoutes from './src/routes/farm.routes.js';
import cropsRoutes from './src/routes/crops.routes.js';
import productsRoutes from './src/routes/products.routes.js';
import ordersRoutes from './src/routes/orders.routes.js';
import expensesRoutes from './src/routes/expenses.routes.js';
import reviewsRoutes from './src/routes/reviews.routes.js';
import adminRoutes from './src/routes/admin.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// Mount REST API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/farm', farmRoutes);
app.use('/api/crops', cropsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), app: config.appName });
});

// Single Page Application Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌾 ${config.appName} is running!`);
  console.log(`🚀 Access Portal: http://localhost:${PORT}`);
  console.log(`👨🌾 Farmer Portal:   http://localhost:${PORT}#farmer`);
  console.log(`🛒 Customer Portal: http://localhost:${PORT}#customer`);
  console.log(`👨💼 Admin Console:   http://localhost:${PORT}#admin`);
  console.log(`=======================================================`);
});
