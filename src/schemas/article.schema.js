import Joi from 'joi';

export const getArticleByIdSchema = Joi.object({
  id: Joi.string()
    .pattern(new RegExp(/^\d{1,}$/))
    .required(),
}).required();

export const getCommentsByArticleIdSchema = Joi.object({
  id: Joi.string()
    .pattern(new RegExp(/^\d{1,}$/))
    .required(),
}).required();

export const postCommentByArticleIdSchema = Joi.object({
  id: Joi.string()
    .pattern(new RegExp(/^\d{1,}$/))
    .required(),
  username: Joi.string().required(),
  body: Joi.string().required(),
}).required();
