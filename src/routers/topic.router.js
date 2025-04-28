import { Router } from 'express';
import { getTopics } from '../controllers/topic.controller.js';

const topicRouter = new Router();

topicRouter.route('/').get(getTopics);

export default topicRouter;
