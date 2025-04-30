import Joi from 'joi';

export const deleteCommentByIdSchema = Joi.object({
  id: Joi.string()
    .pattern(new RegExp(/^\d{1,}$/))
    .required(),
}).required();

export const patchCommentByIdSchema = Joi.object({
  id: Joi.string()
    .pattern(new RegExp(/^\d{1,}$/))
    .required(),
  inc_votes: Joi.number().integer().required(),
}).required();
