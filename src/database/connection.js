import { config } from 'dotenv';
import { Pool } from 'pg';

const ENV = process.env.NODE_ENV || 'development';

config({ path: `${import.meta.dirname}/../../.env.${ENV}` });

console.log(ENV, '<<<< env');
console.log(process.env.PGDATABASE, '<<<< pgdatabase');

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}
const pgconfig = {};

if (ENV === 'production') {
  pgconfig.connectionString = process.env.DATABASE_URL;
  pgconfig.max = 2;
}

export default new Pool(pgconfig);
