import express from 'express';
import morgan from 'morgan';
import {
  apiRouter,
  articleRouter,
  commentRouter,
  topicRouter,
  userRouter,
} from './routers/index.js';
import { handleError, handleNotFound } from './middleware/index.js';

const app = express();

app.use(morgan('common'));

app.use(express.json());

app.use('/api', apiRouter);
app.use('/api/articles', articleRouter);
app.use('/api/comments', commentRouter);
app.use('/api/topics', topicRouter);
app.use('/api/users', userRouter);

app.get('/*splat', handleNotFound);
app.use(handleError);

export default app;
