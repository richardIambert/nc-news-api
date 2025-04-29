import { APIError, withTryCatch } from '../utilities/index.js';
import { getUserByUsernameSchema } from '../schemas/user.schema.js';
import { selectAllUsers, selectUserByUsername } from '../models/user.model.js';

export const getUsers = withTryCatch(async (request, response, next) => {
  const users = await selectAllUsers();
  return response.status(200).json({ users });
});

export const getUserByUsername = withTryCatch(async (request, response, next) => {
  const { error } = getUserByUsernameSchema.validate(request.params);
  if (error) throw new APIError(400, 'bad request');
  const user = await selectUserByUsername(request.params.username);
  if (!user) throw new APIError(404, 'resource not found');
  return response.status(200).json({ user });
});
