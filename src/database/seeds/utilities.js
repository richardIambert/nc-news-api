import format from 'pg-format';
import db from '../connection.js';

export const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

export const createTable = async (tableName, createFields, insertFields, data) => {
  try {
    await db.query(`CREATE TABLE ${tableName} (${createFields.join(',\n')});`);
    return await db.query(
      format(`INSERT INTO ${tableName} (${insertFields.join(', ')}) VALUES %L RETURNING *;`, data)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const createRef = (rows, key, value) => {
  if (rows.length === 0) return {};
  return rows.reduce((refObj, row) => ({ [row[key]]: row[value], ...refObj }), {});
};
