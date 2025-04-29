import Joi from 'joi';

export const getUserByUsernameSchema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9_-]+$/))
    .required(),
}).required();
