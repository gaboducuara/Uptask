import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes'

dotenv.config()

connectDB()

const app: express.Application = express();

app.use(express.json())

//Routes
app.use('/api/project', projectRoutes )
export default app;