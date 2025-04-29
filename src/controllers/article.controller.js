import { APIError, withTryCatch } from '../utilities/index.js';
import { getArticleByIdSchema, getCommentsByArticleIdSchema } from '../schemas/article.schema.js';
import {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticleId,
} from '../models/article.model.js';

export const getArticles = withTryCatch(async (request, response, next) => {
  const articles = await selectAllArticles();
  return response.status(200).json({ articles });
});

export const getArticleById = withTryCatch(async (request, response, next) => {
  const { error } = getArticleByIdSchema.validate(request.params);
  if (error) throw new APIError(400, 'bad request');
  const article = await selectArticleById(request.params.id);
  if (!article) throw new APIError(404, 'resource not found');
  return response.status(200).json({ article });
});

export const getCommentsByArticleId = withTryCatch(async (request, response, next) => {
  const { error } = getCommentsByArticleIdSchema.validate(request.params);
  if (error) throw new APIError(400, 'bad request');
  const article = await selectArticleById(request.params.id);
  if (!article) throw new APIError(404, 'resource not found');
  const comments = await selectCommentsByArticleId(request.params.id);
  return response.status(200).json({ comments });
});
