import { APIError, withTryCatch } from '../utilities/index.js';
import {
  deleteArticleByIdSchema,
  getArticleByIdSchema,
  getArticlesSchema,
  getCommentsByArticleIdSchema,
  patchArticleByIdSchema,
  postArticleSchema,
  postCommentByArticleIdSchema,
} from '../schemas/article.schema.js';
import {
  selectArticlesWhere,
  selectArticleById,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleById,
  insertArticle,
  deleteArticle,
} from '../models/article.model.js';
import { selectUserByUsername } from '../models/user.model.js';
import { selectTopicBySlug } from '../models/topic.model.js';

export const getArticles = withTryCatch(async (request, response, next) => {
  const { error } = getArticlesSchema.validate(request.query);
  if (error) throw new APIError(400, 'bad request');
  if (request.query.topic) {
    const topic = await selectTopicBySlug(request.query.topic);
    if (!topic) throw new APIError(400, 'bad request');
  }
  const articles = await selectArticlesWhere(request.query);
  return response.status(200).json({ articles, total_count: articles.length });
});

export const getArticleById = withTryCatch(async (request, response, next) => {
  const { error } = getArticleByIdSchema.validate(request.params);
  if (error) throw new APIError(400, 'bad request');
  const article = await selectArticleById(request.params.id);
  if (!article) throw new APIError(404, 'resource not found');
  return response.status(200).json({ article });
});

export const getCommentsByArticleId = withTryCatch(async (request, response, next) => {
  const { error } = getCommentsByArticleIdSchema.validate({ ...request.params, ...request.query });
  if (error) throw new APIError(400, 'bad request');
  const article = await selectArticleById(request.params.id);
  if (!article) throw new APIError(404, 'resource not found');
  const comments = await selectCommentsByArticleId(request.params.id, request.query);
  return response.status(200).json({ comments });
});

export const postCommentByArticleId = withTryCatch(async (request, response, next) => {
  const { error } = postCommentByArticleIdSchema.validate({
    ...request.params,
    ...request.body,
  });
  if (error) throw new APIError(400, 'bad request');
  const { username } = request.body;
  const user = await selectUserByUsername(username);
  if (!user) throw new APIError(400, 'bad request');
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

export const postArticle = withTryCatch(async (request, response, next) => {
  const { error } = postArticleSchema.validate(request.body);
  if (error) throw new APIError(400, 'bad request');
  const { author: username, topic: slug } = request.body;
  const user = await selectUserByUsername(username);
  if (!user) throw new APIError(400, 'bad request');
  const topic = await selectTopicBySlug(slug);
  if (!topic) throw new APIError(400, 'bad request');
  const article = await insertArticle(request.body);
  return response.status(201).json({ article });
});

export const deleteArticleById = withTryCatch(async (request, response, next) => {
  const { error } = deleteArticleByIdSchema.validate(request.params);
  if (error) throw new APIError(400, 'bad request');
  const article = await deleteArticle(request.params.id);
  if (!article) throw new APIError(404, 'resource not found');
  return response.status(204).end();
});
