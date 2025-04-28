import { Router } from 'express';
import { getArticles, getArticleById } from '../controllers/article.controller.js';

const articleRouter = new Router();

articleRouter.route('/').get(getArticles);

articleRouter.route('/:id').get(getArticleById);

export default articleRouter;
