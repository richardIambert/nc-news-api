import db from '../connection.js';
import { convertTimestampToDate, createRef, createTable } from './utilities.js';

const seed = async ({ topicData, userData, articleData, commentData }) => {
  // drop tables
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  // =======================
  // topics
  // =======================

  await createTable(
    'topics',
    [
      'slug VARCHAR(255) PRIMARY KEY',
      'description VARCHAR(255) NOT NULL',
      'img_url VARCHAR(1000) NOT NULL',
    ],
    ['slug', 'description', 'img_url'],
    topicData.map(({ slug, description, img_url }) => [slug, description, img_url])
  );

  // =======================
  // users
  // =======================

  await createTable(
    'users',
    [
      'username VARCHAR(255) PRIMARY KEY',
      'name VARCHAR(255) NOT NULL',
      'avatar_url VARCHAR(1000) NOT NULL',
    ],
    ['username', 'name', 'avatar_url'],
    userData.map(({ username, name, avatar_url }) => [username, name, avatar_url])
  );

  // =======================
  // articles
  // =======================

  const results = await createTable(
    'articles',
    [
      'article_id SERIAL PRIMARY KEY',
      'title VARCHAR(255) NOT NULL',
      'topic VARCHAR(255)',
      'FOREIGN KEY (topic) REFERENCES topics(slug)',
      'author VARCHAR(255)',
      'FOREIGN KEY (author) REFERENCES users(username)',
      'body TEXT NOT NULL',
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      'votes INT DEFAULT 0',
      'article_img_url VARCHAR(1000) NOT NULL',
    ],
    ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url'],
    articleData.map((article) => {
      const { title, topic, author, body, created_at, votes, article_img_url } =
        convertTimestampToDate(article);
      return [title, topic, author, body, created_at, votes, article_img_url];
    })
  );

  // =======================
  // comments
  // =======================

  const lookup = createRef(results.rows, 'title', 'article_id');
  await createTable(
    'comments',
    [
      'comment_id SERIAL PRIMARY KEY',
      'article_id INT',
      'FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE',
      'body TEXT NOT NULL',
      'votes INT DEFAULT 0',
      'author VARCHAR(255)',
      'FOREIGN KEY (author) REFERENCES users(username)',
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    ],
    ['article_id', 'body', 'votes', 'author', 'created_at'],
    commentData.map((comment) => {
      const { article_title, body, votes, author, created_at } = convertTimestampToDate(comment);
      const article_id = lookup[article_title];
      return [article_id, body, votes, author, created_at];
    })
  );
};

export default seed;
