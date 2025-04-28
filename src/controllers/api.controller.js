import endpoints from '../../endpoints.json' with {type: 'json'};
import { withTryCatch } from '../utilities/index.js';

export const getAPI = withTryCatch((request, response, next) => {
  return response.status(200).json({ endpoints });
});
