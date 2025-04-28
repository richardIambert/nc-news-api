import { Router } from 'express';
import { getArticleById } from '../controllers/article.controller.js';

const articleRouter = new Router();

articleRouter.route('/:id').get(getArticleById);

export default articleRouter;
