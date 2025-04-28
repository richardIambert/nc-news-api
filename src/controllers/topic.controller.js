import { withTryCatch } from '../utilities/index.js';
import { selectAllTopics } from '../models/topic.model.js';

export const getTopics = withTryCatch(async (request, response, next) => {
  const topics = await selectAllTopics();
  return response.status(200).json({ topics });
});
