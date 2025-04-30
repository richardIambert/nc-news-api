import Joi from 'joi';

export const getArticlesSchema = Joi.object({
  sort_by: Joi.string().valid('author', 'comment_count', 'title', 'topic', 'votes'),
  order: Joi.string().valid('asc', 'desc'),
  topic: Joi.string().valid('cats', 'coding', 'cooking', 'football', 'mitch', 'paper'), // TODO: This would need to be updated dynamically as new topics are added.
});

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

export const patchArticleByIdSchema = Joi.object({
  id: Joi.string()
    .pattern(new RegExp(/^\d{1,}$/))
    .required(),
  inc_votes: Joi.number().required(),
}).required();

export const postArticleSchema = Joi.object({
  author: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9_-]+$/))
    .required(), // INFO: This can be changed to accommodate more valid username characters.
  title: Joi.string().max(255).required(),
  body: Joi.string().required(),
  topic: Joi.string().valid('cats', 'coding', 'cooking', 'football', 'mitch', 'paper'), // TODO: This would need to be updated dynamically as new topics are added
  article_img_url: Joi.string().max(1000), // INFO: Max value added to match filed constraint in database. This might need increasing.
}).required();
