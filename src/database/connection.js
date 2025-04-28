import { config } from 'dotenv';
import pg from 'pg';

config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}` });

const db = new pg.Pool();

if (!process.env.PGDATABASE) {
  console.error(`No PGDATABASE configured
HINT: Have you setup the required environment variables?
https://github.com/richardIambert/seed-db/tree/main?tab=readme-ov-file#3-setup-environment-variables
  `);
  process.exit(1);
} else {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

export default db;
