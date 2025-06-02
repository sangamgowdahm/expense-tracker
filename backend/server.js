import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { configDotenv } from 'dotenv';
import e from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
configDotenv();
import authRoutes from './routes/authRoutes.js';
const app = express();
import { fileURLToPath } from 'url';
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json());

connectDB();

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/income",incomeRoutes);
app.use("/api/v1/expense",expenseRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname,'uploads')));


const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`server runing on port ${PORT}`))