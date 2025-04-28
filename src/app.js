import express from 'express';
import { APIRouter, articleRouter, topicRouter } from './routers/index.js';
import { handleError, handleNotFound } from './middleware/index.js';

const app = express();

app.use('/api', APIRouter);
app.use('/api/articles', articleRouter);
app.use('/api/topics', topicRouter);

app.get('/*splat', handleNotFound);
app.use(handleError);

export default app;
