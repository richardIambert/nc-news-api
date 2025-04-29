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

export const selectUserByUsername = async (username) => {
  const { rows: users } = await db.query(
    `
      SELECT
        username,
        name,
        avatar_url
      FROM
        users
      WHERE
        username = $1;
    `,
    [username]
  );
  return users[0];
};
