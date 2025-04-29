import format from 'pg-format';
import db from '../database/connection.js';

export const selectArticlesWhere = async (query) => {
  const { topic, sort_by, order } = query;
  const topicEquals = topic ? '%L' : '%s';
  const { rows: articles } = await db.query(
    format(
      `
        SELECT
          a.article_id,
          a.title,
          a.topic,
          a.author,
          a.created_at,
          a.votes,
          a.article_img_url,
          COUNT(c.article_id)::INT as comment_count
        FROM
          articles AS a
          LEFT JOIN comments AS c ON a.article_id = c.article_id
        WHERE
          topic = ${topicEquals}
        GROUP BY
          a.article_id
        ORDER BY
          %I %s;
      `,
      topic || 'topic',
      sort_by || 'created_at',
      order || 'DESC'
    )
  );
  return articles;
};

export const selectArticleById = async (id) => {
  const { rows } = await db.query(
    `
      SELECT 
        a.article_id,
        a.title,
        a.topic,
        a.author,
        a.body,
        a.created_at,
        a.votes,
        a.article_img_url,
        COUNT(c.article_id)::INT AS comment_count
      FROM 
        articles AS a 
        LEFT JOIN comments AS c ON a.article_id = c.article_id
      WHERE 
        a.article_id = $1
      GROUP BY
        a.article_id;
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
