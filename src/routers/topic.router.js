import { Router } from 'express';
import { getTopics, postTopic } from '../controllers/topic.controller.js';

const topicRouter = new Router();

topicRouter.route('/').get(getTopics).post(postTopic);

export default topicRouter;
