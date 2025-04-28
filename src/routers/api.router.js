import { Router } from 'express';
import { getAPI } from '../controllers/api.controller.js';

const apiRouter = new Router();

apiRouter.route('/').get(getAPI);

export default apiRouter;
