import { Router } from 'express';
import { getAPI } from '../controllers/api.controller.js';

const APIRouter = new Router();

APIRouter.route('/').get(getAPI);

export default APIRouter;
