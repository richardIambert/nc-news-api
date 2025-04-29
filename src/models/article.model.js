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
  const { rows } = await db.query(
    `
      SELECT 
        * 
      FROM 
        articles 
      WHERE 
        article_id = $1;
    `,
    [id]
  );
  return rows[0];
};

export const selectCommentsByArticleId = async (id) => {
  const { rows: comments } = await db.query(
    `
      SELECT
        comment_id,
        article_id,
        author,
        votes,
        body,
        created_at
      FROM
        comments
      WHERE
        article_id = $1
      ORDER BY
        created_at DESC;
    `,
    [id]
  );
  return comments;
};

export const insertCommentByArticleId = async (id, comment) => {
  const { username: author, body } = comment;
  const { rows: comments } = await db.query(
    `
      INSERT INTO 
        comments (article_id, author, body) 
      VALUES 
        ($1, $2, $3)
      RETURNING 
        *;
    `,
    [id, author, body]
  );
  return comments[0];
};

export const updateArticleById = async (id, update) => {
  const { inc_votes } = update;
  const { rows } = await db.query(
    `
      UPDATE 
        articles
      SET  
        votes = votes + $1
      WHERE
        article_id = $2
      RETURNING
        *;
    `,
    [inc_votes, id]
  );
  return rows[0];
};
