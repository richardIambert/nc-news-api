import { APIError, withTryCatch } from '../utilities/index.js';
import { getArticleByIdSchema } from '../schemas/article.schema.js';
import { selectArticleById } from '../models/article.model.js';

export const getArticleById = withTryCatch(async (request, response, next) => {
  const { error } = getArticleByIdSchema.validate(request.params);
  if (error) throw new APIError(400, 'bad request');
  const article = await selectArticleById(request.params.id);
  if (!article) throw new APIError(404, 'resource not found');
  return response.status(200).json({ article });
});
