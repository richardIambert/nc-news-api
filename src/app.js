import express from 'express';
import { APIRouter } from './routers/index.js';

const app = express();

app.use('/api', APIRouter);

export default app;
