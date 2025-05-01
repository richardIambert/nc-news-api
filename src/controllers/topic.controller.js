import { APIError, withTryCatch } from '../utilities/index.js';
import { postTopicSchema } from '../schemas/topic.schema.js';
import { insertTopic, selectAllTopics, selectTopicBySlug } from '../models/topic.model.js';

export const getTopics = withTryCatch(async (request, response, next) => {
  const topics = await selectAllTopics();
  return response.status(200).json({ topics });
});

export const postTopic = withTryCatch(async (request, response, next) => {
  const { error } = postTopicSchema.validate(request.body);
  if (error) throw new APIError(400, 'bad request');
  const existingTopic = await selectTopicBySlug(request.body.slug);
  if (existingTopic) throw new APIError(422, 'topic already exists');
  const topic = await insertTopic(request.body);
  return response.status(201).json({ topic });
});
