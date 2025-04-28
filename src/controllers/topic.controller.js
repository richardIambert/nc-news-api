import db from '../database/connection.js';
import { withTryCatch } from '../utilities/index.js';

export const getTopics = withTryCatch(async (request, response, next) => {
  const { rows: topics } = await db.query('SELECT slug, description FROM topics;');
  return response.status(200).json({ topics });
});
