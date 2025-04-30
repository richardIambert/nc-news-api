import { APIError, withTryCatch } from '../utilities/index.js';
import {
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
} from '../models/article.model.js';
import { selectUserByUsername } from '../models/user.model.js';

export const getArticles = withTryCatch(async (request, response, next) => {
  const { error } = getArticlesSchema.validate(request.query);
  if (error) throw new APIError(400, 'bad request');
  const articles = await selectArticlesWhere(request.query);
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

export const postArticle = withTryCatch(async (request, response, next) => {
  // INFO: This request could potentially throw if a user/author or topic doesn't exist.
  // TODO: We don't want users to be able to proxy create new topics through this endpoint.
  // TODO: We don't want users to be able to create articles authored by users that don't exist.
  // INFO: It should also throw when trying to create identical or similar articles.
  // TODO: Do we want users to be able to create and article if it has the same author (user) and title as an existing article.
  const { error } = postArticleSchema.validate(request.body);
  if (error) throw new APIError(400, 'bad request'); // Throw if req.body is invalid, including topic doesn't exist.
  const { author } = request.body;
  const user = await selectUserByUsername(author);
  if (!user) throw new APIError(400, 'bad request'); // Throw if article is author doesn't exist.
  const article = await insertArticle(request.body);
  return response.status(201).json({ article });
});
