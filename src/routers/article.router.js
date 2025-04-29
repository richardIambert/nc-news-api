import { Router } from 'express';
import {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
} from '../controllers/article.controller.js';

const articleRouter = new Router();

articleRouter.route('/').get(getArticles);

articleRouter.route('/:id/comments').get(getCommentsByArticleId).post(postCommentByArticleId);

articleRouter.route('/:id').get(getArticleById);

export default articleRouter;
