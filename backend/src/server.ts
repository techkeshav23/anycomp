import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRouter from './routes/auth';
import specialistsRouter from './routes/specialists';
import mediaRouter from './routes/media';
import { verifyCloudinaryConfig } from './config/cloudinary';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL?.replace(/\/$/, ''), // Remove trailing slash if present
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Remove trailing slash from origin for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, origin);
    } else {
      callback(null, true); // Allow all origins in development, you can restrict in production
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/specialists', specialistsRouter);
app.use('/api/media', mediaRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler (must be before error handler)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize TypeORM and start server
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully (PostgreSQL/Neon)');
    
    // Verify Cloudinary configuration
    verifyCloudinaryConfig();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

export default app;
