import devData from '../data/development-data/index.js';
import testData from '../data/test-data/index.js';
import seed from './seed.js';
import db from '../connection.js';

const runSeed = async () => {
  await seed(process.env.NODE_ENV === 'test' ? testData : devData);
  db.end();
};

runSeed();
