import { Router } from 'express';
import {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} from '../controllers/article.controller.js';

const articleRouter = new Router();

articleRouter.route('/').get(getArticles);

articleRouter
  .route('/:id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

articleRouter.route('/:id').get(getArticleById).patch(patchArticleById);

export default articleRouter;
