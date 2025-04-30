import Joi from 'joi';

export const getUserByUsernameSchema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9_-]+$/))
    .required(), // INFO: this can be changed to accommodate more valid username characters
}).required();
