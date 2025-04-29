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
