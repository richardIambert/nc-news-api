import db from '../database/connection.js';

export const selectAllUsers = async () => {
  const { rows: users } = await db.query(
    `
      SELECT
        username,
        name,
        avatar_url
      FROM
        users;
    `
  );
  return users;
};
