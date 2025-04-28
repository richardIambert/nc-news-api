import express from 'express';
import { APIRouter } from './routers/index.js';
import { handleError, handleNotFound } from './middleware/index.js';

const app = express();

app.use('/api', APIRouter);

app.get('/*splat', handleNotFound);
app.use(handleError);

export default app;
