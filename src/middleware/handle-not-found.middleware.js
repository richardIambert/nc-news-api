import { APIError } from '../utilities/index.js';

export const handleNotFound = (request, response, next) => {
  return next(new APIError(404, 'resource not found'));
};
