import { withTryCatch } from '../utilities/index.js';
import { selectAllUsers } from '../models/user.model.js';

export const getUsers = withTryCatch(async (request, response, next) => {
  const users = await selectAllUsers();
  return response.status(200).json({ users });
});
