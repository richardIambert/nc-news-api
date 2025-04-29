import Joi from 'joi';

export const deleteCommentByIdSchema = Joi.object({
  id: Joi.string()
    .pattern(new RegExp(/^\d{1,}$/))
    .required(),
}).required();
