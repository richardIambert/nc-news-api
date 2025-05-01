import { Router } from 'express';
import {
  getArticles,
  getArticleById,
  postArticle,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteArticleById,
} from '../controllers/article.controller.js';

const articleRouter = new Router();

articleRouter.route('/').get(getArticles).post(postArticle);

articleRouter.route('/:id/comments').get(getCommentsByArticleId).post(postCommentByArticleId);

articleRouter.route('/:id').get(getArticleById).patch(patchArticleById).delete(deleteArticleById);

export default articleRouter;
