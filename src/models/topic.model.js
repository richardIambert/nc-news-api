import db from '../database/connection.js';

export const selectAllTopics = async () => {
  const { rows: topics } = await db.query(
    `
      SELECT 
        slug, description 
      FROM 
        topics;
    `
  );
  return topics;
};

export const selectTopicBySlug = async (slug) => {
  const { rows: topics } = await db.query(
    `
      SELECT 
        slug, description 
      FROM 
        topics
      WHERE
        slug = $1;
    `,
    [slug]
  );
  return topics[0];
};

export const insertTopic = async (topic) => {
  const { slug, description, img_url = '/assets/placeholder/topic.jpg' } = topic;
  const { rows: topics } = await db.query(
    `
      INSERT INTO
        topics (slug, description, img_url)
      VALUES
        ($1, $2, $3)
      RETURNING
        *;
    `,
    [slug, description, img_url]
  );
  return topics[0];
};
