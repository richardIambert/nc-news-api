import db from '../database/connection.js';

export const selectArticleById = async (id) => {
  const { rows } = await db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id]);
  return rows[0];
};
