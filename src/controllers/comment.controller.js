import { APIError, withTryCatch } from '../utilities/index.js';
import { deleteCommentByIdSchema, patchCommentByIdSchema } from '../schemas/comment.schema.js';
import { deleteComment, updateCommentById } from '../models/comment.model.js';

export const deleteCommentById = withTryCatch(async (request, response, next) => {
  const { error } = deleteCommentByIdSchema.validate(request.params);
  if (error) throw new APIError(400, 'bad request');
  const comment = await deleteComment(request.params.id);
  if (!comment) throw new APIError(404, 'resource not found');
  return response.status(204).end();
});

export const patchCommentById = withTryCatch(async (request, response, next) => {
  const { error } = patchCommentByIdSchema.validate({ ...request.params, ...request.body });
  if (error) throw new APIError(400, 'bad request');
  const comment = await updateCommentById(request.params.id, request.body);
  if (!comment) throw new APIError(404, 'resource not found');
  return response.status(200).json({ comment });
});
