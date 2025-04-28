import Joi from 'joi';

export const getArticleByIdSchema = Joi.object({
  id: Joi.string()
    .pattern(new RegExp(/^\d{1,}$/))
    .required(),
});
