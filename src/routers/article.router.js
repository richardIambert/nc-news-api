import { Router } from 'express';
import {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
} from '../controllers/article.controller.js';

const articleRouter = new Router();

articleRouter.route('/').get(getArticles);

articleRouter.route('/:id/comments').get(getCommentsByArticleId);

articleRouter.route('/:id').get(getArticleById);

export default articleRouter;
