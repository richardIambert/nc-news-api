import { APIError, withTryCatch } from '../utilities/index.js';
import {
  getArticleByIdSchema,
  getCommentsByArticleIdSchema,
  patchArticleByIdSchema,
  postCommentByArticleIdSchema,
} from '../schemas/article.schema.js';
import {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleById,
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

export const postCommentByArticleId = withTryCatch(async (request, response, next) => {
  // TODO: account for potential 400 when trying to post a comment with a username that doesn't exist
  const { error } = postCommentByArticleIdSchema.validate({
    ...request.params,
    ...request.body,
  });
  if (error) throw new APIError(400, 'bad request');
  const article = await selectArticleById(request.params.id);
  if (!article) throw new APIError(404, 'resource not found');
  const comment = await insertCommentByArticleId(request.params.id, request.body);
  return response.status(201).json({ comment });
});

export const patchArticleById = withTryCatch(async (request, response, next) => {
  const { error } = patchArticleByIdSchema.validate({
    ...request.params,
    ...request.body,
  });
  if (error) throw new APIError(400, 'bad request');
  const exists = await selectArticleById(request.params.id);
  if (!exists) throw new APIError(404, 'resource not found');
  const article = await updateArticleById(request.params.id, request.body);
  return response.status(200).json({ article });
});
