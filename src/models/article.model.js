import db from '../database/connection.js';

export const selectAllArticles = async () => {
  const { rows: articles } = await db.query(
    `
      SELECT
        a.article_id,
        a.author,
        a.title,
        a.topic,
        a.created_at,
        a.votes,
        a.article_img_url,
        COUNT(c.article_id) as comment_count
      FROM
        articles AS a
        LEFT JOIN comments AS c ON a.article_id = c.article_id
      GROUP BY
        a.article_id
      ORDER BY
        a.created_at DESC;
    `
  );
  return articles;
};

export const selectArticleById = async (id) => {
  const { rows } = await db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id]);
  return rows[0];
};
