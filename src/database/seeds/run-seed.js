import devData from '../data/development-data/index.js';
import seed from './seed.js';
import db from '../connection.js';

const runSeed = async () => {
  await seed(devData);
  db.end();
};

runSeed();
