import db from '../database/connection.js';

export const selectAllTopics = async () => {
  const { rows: topics } = await db.query('SELECT slug, description FROM topics;');
  return topics;
};
