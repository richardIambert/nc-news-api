import Joi from 'joi';

export const postTopicSchema = Joi.object({
  slug: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(255).required(),
  img_url: Joi.string().min(0).max(1000),
}).required();
