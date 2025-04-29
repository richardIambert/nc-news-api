import { config } from 'dotenv';
import pg from 'pg';

const ENV = process.env.NODE_ENV || 'development';

config({ path: `${import.meta.dirname}/../../.env.${ENV}` });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

export default new pg.Pool(
  {
    test: {},
    development: {},
    production: {
      connectionString: process.env.DATABASE_URL,
      max: 2,
    },
  }[ENV]
);
