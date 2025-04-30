import db from '../database/connection.js';

export const deleteComment = async (id) => {
  const { rows: comments } = await db.query(
    `
      DELETE FROM
        comments
      WHERE
        comment_id = $1
      RETURNING
        *;
    `,
    [id]
  );
  return comments.length ? comments[0] : null;
};

export const updateCommentById = async (id, update) => {
  const { inc_votes } = update;
  const { rows: comments } = await db.query(
    `
      UPDATE 
        comments
      SET
        votes = votes + $1
      WHERE
        comment_id = $2
      RETURNING
        *;
    `,
    [inc_votes, id]
  );
  return comments[0];
};
