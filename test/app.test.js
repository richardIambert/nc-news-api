import { afterAll, beforeEach, describe, expect, test } from 'vitest';
import db from '../src/database/connection.js';
import seed from '../src/database/seeds/seed.js';
import data from '../src/database/data/test-data/index.js';
import endpointsJSON from '../endpoints.json';
import request from 'supertest';
import app from '../src/app.js';

beforeEach(() => seed(data));
afterAll(() => db.end());

// ====================================
//  App Error Conditions
// ====================================

describe('app error conditions', () => {
  describe('resource not found', () => {
    test("404: responds with a 404 status and message of 'resource not found' when requesting an endpoint that doesn't exist", async () => {
      const { statusCode, body } = await request(app).get('/this/route/does/not/exist');
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty('message', 'resource not found');
    });
  });
});

// ====================================
//  API
// ====================================

describe('/api', () => {
  describe('GET /api', () => {
    test('200: responds with an object detailing the documentation for each endpoint', async () => {
      const response = await request(app).get('/api');
      expect(response.statusCode).toBe(200);
      expect(response.body.endpoints).toEqual(endpointsJSON);
    });
  });
});

// ====================================
//  Topics
// ====================================

describe('/api/topics', () => {
  describe('POST /api/topics (CREATE ONE)', () => {
    test('201: responds with with an object having a key of `topic` and value that is an object representing the newly created topic', async () => {
      const { statusCode, body } = await request(app).post('/api/topics').send({
        slug: 'jokes',
        description: 'not mean, keep it clean',
        img_url: '/assets/img/topics/jokes.jpg',
      });
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('topic');
      expect(body.topic).toMatchObject({
        slug: 'jokes',
        description: 'not mean, keep it clean',
        img_url: '/assets/img/topics/jokes.jpg',
      });
    });
    test('201: newly created topic has the default `img_url` value if not present in request body ', async () => {
      const { statusCode, body } = await request(app).post('/api/topics').send({
        slug: 'jokes',
        description: 'not mean, keep it clean',
      });
      expect(statusCode).toBe(201);
      expect(body.topic).toHaveProperty('img_url', '/assets/placeholder/topic.jpg');
    });
    test("400: responds with a 400 status and message of 'bad request' when passed an invalid request body", async () => {
      const empty = {};
      const missingProperty = {
        // slug missing
        description: 'not mean, keep it clean',
      };
      const invalidPropertyValue = {
        slug: 1337, // should be string
        description: 'not mean, keep it clean',
      };
      const { statusCode: statusCode1, body: body1 } = await request(app)
        .post('/api/topics')
        .send(empty);
      expect(statusCode1).toBe(400);
      expect(body1).toHaveProperty('message', 'bad request');
      const { statusCode: statusCode2, body: body2 } = await request(app)
        .post('/api/topics')
        .send(missingProperty);
      expect(statusCode2).toBe(400);
      expect(body2).toHaveProperty('message', 'bad request');
      const { statusCode: statusCode3, body: body3 } = await request(app)
        .post('/api/topics')
        .send(invalidPropertyValue);
      expect(statusCode3).toBe(400);
      expect(body3).toHaveProperty('message', 'bad request');
    });
    test("422: responds with a 422 status and a message of 'topic already exists' if a topic with a matching `slug` value already exists", async () => {
      const { statusCode, body } = await request(app).post('/api/topics').send({
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
        img_url: '',
      });
      expect(statusCode).toBe(422);
      expect(body).toHaveProperty('message', 'topic already exists');
    });
  });
  describe('GET /api/topics (READ ALL)', () => {
    test('200: responds with an object having a key of `topics` and value that is an array containing all topics', async () => {
      const { statusCode, body } = await request(app).get('/api/topics');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('topics');
      const { topics } = body;
      expect(Array.isArray(topics)).toBe(true);
      expect(topics).toHaveLength(3);
      for (const topic of topics) {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      }
    });
  });
});

// ====================================
//  Articles
// ====================================

describe('/api/articles', () => {
  describe('POST /api/articles (CREATE ONE)', () => {
    test('201: responds with with an object having a key of `article` and value that is an object representing the newly created article', async () => {
      const { statusCode, body } = await request(app).post('/api/articles').send({
        author: 'butter_bridge',
        title: 'Who is Mitch?',
        body: 'The man behind the legend that is Mitch',
        topic: 'mitch',
        article_img_url: '/path/to/image/of/mitch/with/one/of/those/balck/strips/across/his/eyes',
      });
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('article');
      const { article } = body;
      expect(article).toMatchObject({
        article_id: expect.any(Number),
        title: 'Who is Mitch?',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'The man behind the legend that is Mitch',
        created_at: expect.any(String),
        votes: 0,
        comment_count: 0,
        article_img_url: '/path/to/image/of/mitch/with/one/of/those/balck/strips/across/his/eyes',
      });
    });
    test('201: newly created article has the default `article_img_url` value if not present in request body', async () => {
      const {
        statusCode,
        body: { article },
      } = await request(app).post('/api/articles').send({
        author: 'butter_bridge',
        title: 'Who is Mitch?',
        body: 'The man behind the legend that is Mitch',
        topic: 'mitch',
      });
      expect(statusCode).toBe(201);
      expect(article).toHaveProperty('article_img_url', '/assets/placeholder/article.jpg');
    });
    test("400: responds with a 400 status and a message of 'bad request' when passed an invalid request body", async () => {
      const empty = {};
      const missingProperty = {
        // author missing
        title: 'Who is Mitch?',
        body: 'The man behind the legend that is Mitch',
        topic: 'mitch',
      };
      const invalidPropertyValue = {
        author: 1, // should be string
        title: 'Who is Mitch?',
        body: 'The man behind the legend that is Mitch',
        topic: 'mitch',
      };
      const { statusCode: statusCode1, body: body1 } = await request(app)
        .post('/api/articles')
        .send(empty);
      expect(statusCode1).toBe(400);
      expect(body1).toHaveProperty('message', 'bad request');
      const { statusCode: statusCode2, body: body2 } = await request(app)
        .post('/api/articles')
        .send(missingProperty);
      expect(statusCode2).toBe(400);
      expect(body2).toHaveProperty('message', 'bad request');
      const { statusCode: statusCode3, body: body3 } = await request(app)
        .post('/api/articles')
        .send(invalidPropertyValue);
      expect(statusCode3).toBe(400);
      expect(body3).toHaveProperty('message', 'bad request');
    });
    test("400: responds with a 400 status and a message of 'bad request' when attempting to create an article with an author (user) that doesn't exist", async () => {
      const { statusCode, body } = await request(app).post('/api/articles').send({
        author: 'userdoesntexist',
        title: 'Who is Mitch?',
        body: 'The man behind the legend that is Mitch',
        topic: 'mitch',
      });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
    test("400: responds with a 400 status and a message of 'bad request' when attempting to create an article with a topic that doesn't exist", async () => {
      const { statusCode, body } = await request(app).post('/api/articles').send({
        author: 'butter_bridge',
        title: 'Who is Mitch?',
        body: 'The man behind the legend that is Mitch',
        topic: 'topicdoesntexist',
      });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
    test.todo(
      "422: responds with a 422 status and a message of 'article already exists' if an article already exists with same title and author"
    );
  });
  describe('GET /api/articles (READ MANY)', () => {
    test('200: responds with an object having a key of `articles` and a value that is an array containing all articles', async () => {
      const { statusCode, body } = await request(app).get('/api/articles');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('total_count', 10);
      expect(body).toHaveProperty('articles'); // does response body have an articles property?
      const { articles } = body;
      expect(Array.isArray(articles)).toBe(true); // is the articles property and array?
      expect(articles).toHaveLength(10); // does the array contain all article records?
      for (const article of articles) {
        expect(article).not.toHaveProperty('body'); // for each article is the body field excluded?
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String), // TODO: research `expect.stringMatching()`
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      }
      expect(articles[0].article_id).toBe(3); // check the articles are arranged in date descending order
      expect(articles[9].article_id).toBe(4);
      expect(articles[0].comment_count).toBe(2); // check the comment counts are correct
      expect(articles[9].comment_count).toBe(0);
    });
    test('200: query string can sort `articles` by author in ascending order', async () => {
      const { statusCode, body } = await request(app).get('/api/articles?sort_by=author&order=asc');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('total_count', 10);
      expect(body).toHaveProperty('articles');
      const { articles } = body;
      expect(Array.isArray(articles)).toBe(true);
      expect(articles).toHaveLength(10);
      expect(articles[0].article_id).toBe(1);
      expect(articles[9].article_id).toBe(8);
    });
    test('200: query string can sort `articles` by title in ascending order', async () => {
      const { statusCode, body } = await request(app).get('/api/articles?sort_by=title&order=asc');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('total_count', 10);
      expect(body).toHaveProperty('articles');
      const { articles } = body;
      expect(Array.isArray(articles)).toBe(true);
      expect(articles).toHaveLength(10);
      expect(articles[0].article_id).toBe(6);
      expect(articles[9].article_id).toBe(4);
    });
    test('200: query string can sort `articles` by topic in ascending order', async () => {
      const { statusCode, body } = await request(app).get('/api/articles?sort_by=topic&order=asc');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('total_count', 10);
      expect(body).toHaveProperty('articles');
      const { articles } = body;
      expect(Array.isArray(articles)).toBe(true);
      expect(articles).toHaveLength(10);
      expect(articles[0].article_id).toBe(5);
      expect(articles[9].article_id).toBe(2);
    });
    test('200: query string can sort `articles` by vote in ascending order', async () => {
      const { statusCode, body } = await request(app).get('/api/articles?sort_by=votes&order=asc');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('total_count', 10);
      expect(body).toHaveProperty('articles');
      const { articles } = body;
      expect(Array.isArray(articles)).toBe(true);
      expect(articles).toHaveLength(10);
      expect(articles[0].article_id).toBe(11);
      expect(articles[9].article_id).toBe(5);
    });
    test('200: query string can sort `articles` by comment_count in ascending order', async () => {
      const { statusCode, body } = await request(app).get(
        '/api/articles?sort_by=comment_count&order=asc'
      );
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('total_count', 10);
      expect(body).toHaveProperty('articles');
      const { articles } = body;
      expect(Array.isArray(articles)).toBe(true);
      expect(articles).toHaveLength(10);
      expect(articles[0].article_id).toBe(4);
      expect(articles[9].article_id).toBe(9);
    });
    test('200: query string can select `articles` by topic', async () => {
      const { statusCode, body } = await request(app).get('/api/articles?topic=cats');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('total_count', 1);
      expect(body).toHaveProperty('articles');
      const { articles } = body;
      expect(articles).toHaveLength(1);
      expect(articles[0].article_id).toBe(5);
    });
    test('200: response is paginated and returns the first 10 articles by default', async () => {
      const { statusCode, body } = await request(app).get('/api/articles');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('total_count', 10);
      expect(body).toHaveProperty('articles');
      const { articles } = body;
      expect(articles).toHaveLength(10);
      expect(articles[0].article_id).toBe(3);
      expect(articles[9].article_id).toBe(4);
    });
    test('200: response is paginated and returns the correct articles when passed `limit` and `p` query parameters', async () => {
      const firstPage = await request(app).get('/api/articles?limit=10&p=0');
      expect(firstPage.body).toHaveProperty('total_count', 10);
      expect(firstPage.body.articles).toHaveLength(10);
      expect(firstPage.body.articles[0].article_id).toBe(3);
      expect(firstPage.body.articles[9].article_id).toBe(4);
      const secondPage = await request(app).get('/api/articles?limit=10&p=1');
      expect(secondPage.body).toHaveProperty('total_count', 3);
      expect(secondPage.body.articles).toHaveLength(3);
      expect(secondPage.body.articles[0].article_id).toBe(8);
      expect(secondPage.body.articles[2].article_id).toBe(7);
    });
    test("400: responds with a 400 status and message of 'bad request' when passed an invalid query string", async () => {
      const { statusCode, body } = await request(app).get(
        '/api/articles?sort_by=;DROP TABLE articles;--&order=;SELECT * FROM users;--'
      );
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
  });
  describe('GET /api/articles/:id (READ ONE)', () => {
    test('200: responds with an object having a key of `article` and value that is an article object', async () => {
      const { statusCode, body } = await request(app).get('/api/articles/1');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('article');
      const { article } = body;
      expect(article).toMatchObject({
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: expect.any(String), // TODO: research `expect.stringMatching()`
        votes: 100,
        article_img_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        comment_count: 11,
      });
    });
    test("400: responds with a 400 status and message of 'bad request' when passed an invalid value for the `id` parameter", async () => {
      const { statusCode, body } = await request(app).get('/api/articles/one');
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
    test("404: responds with a 404 status and message of 'resource not found' when no article exists with given `id`", async () => {
      const { statusCode, body } = await request(app).get('/api/articles/14');
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty('message', 'resource not found');
    });
  });
  describe('PATCH /api/articles/:id (UPDATE ONE)', () => {
    test('200: responds with with an object having a key of `article` and value that is an object representing the updated article', async () => {
      const { statusCode, body } = await request(app).patch('/api/articles/1').send({
        inc_votes: -100,
      });
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('article');
      expect(body.article).toMatchObject({
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: expect.any(String), // TODO: research `expect.stringMatching()`
        votes: 0,
        article_img_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
      });
    });
    test("400: responds with a 400 status and message of 'bad request' when passed an invalid `id` parameter", async () => {
      const { statusCode, body } = await request(app).patch('/api/articles/one').send({
        inc_votes: 1,
      });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
    test("400: responds with a 400 status and a message of 'bad request' when passed an invalid request body", async () => {
      const { statusCode, body } = await request(app).patch('/api/articles/1').send({});
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
    test("404: responds with a 404 status and message of 'resource not found' when no article exists with given `id`", async () => {
      const { statusCode, body } = await request(app).patch('/api/articles/4242424').send({
        inc_votes: 1,
      });
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty('message', 'resource not found');
    });
  });
  describe('DELETE /api/articles/:id (DELETE ONE)', () => {
    test('204: responds with a status of 204 and an empty response body having successfully deleted an article with a given `id`', async () => {
      const { statusCode, body } = await request(app).delete('/api/articles/1');
      expect(statusCode).toBe(204);
      expect(body).toEqual({});
    });
    test('204: should delete all associated comments', async () => {
      const { rows: commentsBeforeDeletion } = await db.query(
        'SELECT * FROM comments WHERE article_id = 1;'
      );
      expect(commentsBeforeDeletion).toHaveLength(11);
      const { statusCode, body } = await request(app).delete('/api/articles/1');
      expect(statusCode).toBe(204);
      expect(body).toEqual({});
      const { rows: commentsAfterDeletion } = await db.query(
        'SELECT * FROM comments WHERE article_id = 1;'
      );
      expect(commentsAfterDeletion).toHaveLength(0);
    });
    test('204: subsequent requests to GET /api/article/:id should return a 404', async () => {
      const getResponseBeforeDelete = await request(app).get('/api/articles/1');
      expect(getResponseBeforeDelete.statusCode).toBe(200);
      await request(app).delete('/api/articles/1');
      const getResponseAfterDelete = await request(app).get('/api/articles/1');
      expect(getResponseAfterDelete.statusCode).toBe(404);
    });
    test("400: responds with a 400 status and a message of 'bad request' when passed an invalid `id` parameter", async () => {
      const { statusCode, body } = await request(app).delete('/api/articles/one');
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
  });
});

// ====================================
//  Comments
// ====================================

describe('/api/comments', () => {
  describe('POST /api/articles/:id/comments (CREATE)', () => {
    test('201: responds with with an object having a key of `comment` and value that is an object representing the newly created comment', async () => {
      const { statusCode, body } = await request(app).post('/api/articles/1/comments').send({
        username: 'butter_bridge',
        body: "I can't read this article! Where are my glasses!?",
      });
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('comment');
      const { comment } = body;
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        article_id: 1,
        author: 'butter_bridge',
        votes: 0,
        body: "I can't read this article! Where are my glasses!?",
        created_at: expect.any(String), // TODO: research `expect.stringMatching()`
      });
    });
    test("400: responds with a 400 status and message of 'bad request' when passed an invalid value for the `id` parameter", async () => {
      const { statusCode, body } = await request(app).post('/api/articles/one/comments').send({
        username: 'butter_bridge',
        body: "I can't read this article! Where are my glasses!?",
      });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
    test("400: responds with a 400 status and message of 'bad request' when passed an invalid value for the request body", async () => {
      const { statusCode: statusCode1, body: body1 } = await request(app)
        .post('/api/articles/1/comments')
        .send({});
      expect(statusCode1).toBe(400);
      expect(body1).toHaveProperty('message', 'bad request');
      const { statusCode: statusCode2, body: body2 } = await request(app)
        .post('/api/articles/1/comments')
        .send({
          body: "I can't read this article! Where are my glasses!?",
        });
      expect(statusCode2).toBe(400);
      expect(body2).toHaveProperty('message', 'bad request');
      const { statusCode: statusCode3, body: body3 } = await request(app)
        .post('/api/articles/1/comments')
        .send({
          username: 'butter_bridge',
        });
      expect(statusCode3).toBe(400);
      expect(body3).toHaveProperty('message', 'bad request');
    });
    test("404: responds with a 404 status and message of 'resource not found' when no article exists with given `id`", async () => {
      const { statusCode, body } = await request(app).post('/api/articles/424242/comments').send({
        username: 'butter_bridge',
        body: "I can't read this article! Where are my glasses!?",
      });
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty('message', 'resource not found');
    });
    test.todo(
      "404: responds with a 404 status and message of 'resource not found' when no user exists with the comment's author name"
    ); // TODO: account for potential 400 when trying to post a comment with a username that doesn't exist
  });
  describe('GET /api/articles/:id/comments (READ ALL)', () => {
    test('200: responds with an object having a key of `comments` and value that is an array containing all comments for a given article', async () => {
      const { statusCode, body } = await request(app).get('/api/articles/1/comments');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('comments');
      const { comments } = body;
      expect(Array.isArray(comments)).toBe(true);
      expect(comments).toHaveLength(10);
      for (const comment of comments) {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          body: expect.any(String),
          created_at: expect.any(String), // TODO: research `expect.stringMatching()`
        });
      }
      expect(comments[0].comment_id).toBe(5);
      expect(comments[9].comment_id).toBe(4);
    });
    test('200: response is paginated and returns the first 10 comments by default ', async () => {
      const { statusCode, body } = await request(app).get('/api/articles/1/comments');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('comments');
      const { comments } = body;
      expect(Array.isArray(comments)).toBe(true);
      expect(comments).toHaveLength(10);
      for (const comment of comments) {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          body: expect.any(String),
          created_at: expect.any(String), // TODO: research `expect.stringMatching()`
        });
      }
      expect(comments[0].comment_id).toBe(5);
      expect(comments[9].comment_id).toBe(4);
    });
    test('200: response is paginated and returns the correct comments when passed `limit` and `p` query parameters', async () => {
      const firstPage = await request(app).get('/api/articles/1/comments?limit=10&p=0');
      expect(firstPage.statusCode).toBe(200);
      expect(firstPage.body.comments).toHaveLength(10);
      expect(firstPage.body.comments[0].comment_id).toBe(5);
      expect(firstPage.body.comments[9].comment_id).toBe(4);
      const secondPage = await request(app).get('/api/articles/1/comments?limit=10&p=1');
      expect(secondPage.statusCode).toBe(200);
      expect(secondPage.body.comments).toHaveLength(1);
      expect(secondPage.body.comments[0].comment_id).toBe(9);
    });
    test("400: responds with a 400 status and message of 'bad request' when passed an invalid value for the `id` parameter", async () => {
      const { statusCode, body } = await request(app).get('/api/articles/one/comments');
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
    test("404: responds with a 404 status and message of 'resource not found' when no article exists with given `id`", async () => {
      const { statusCode, body } = await request(app).get('/api/articles/424242/comments');
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty('message', 'resource not found');
    });
  });
  describe('PATCH /api/comments/:id (UPDATE ONE)', () => {
    test('200: responds with with an object having a key of `article` and value that is an object representing the updated article', async () => {
      const { statusCode: statusCode1, body: body1 } = await request(app)
        .patch('/api/comments/1')
        .send({
          inc_votes: 1,
        });
      expect(statusCode1).toBe(200);
      expect(body1).toHaveProperty('comment');
      expect(body1.comment).toHaveProperty('votes', 17);
      const { statusCode: statusCode2, body: body2 } = await request(app)
        .patch('/api/comments/1')
        .send({
          inc_votes: -1,
        });
      expect(statusCode2).toBe(200);
      expect(body2).toHaveProperty('comment');
      expect(body2.comment).toHaveProperty('votes', 16);
    });
    test("400: responds with a 400 status and a message of 'bad request' when passed an invalid `id` parameter", async () => {
      const { statusCode, body } = await request(app).patch('/api/comments/one').send({
        inc_votes: 1,
      });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
    test("400: responds with a 400 status and a message of 'bad request' when passed an invalid request body", async () => {
      const { statusCode: statusCode1, body: body1 } = await request(app)
        .patch('/api/comments/1')
        .send({
          inc_votes: 'one', // strings not allowed
        });
      expect(statusCode1).toBe(400);
      expect(body1).toHaveProperty('message', 'bad request');
      const { statusCode: statusCode2, body: body2 } = await request(app)
        .patch('/api/comments/1')
        .send({
          inc_votes: 1.1, // decimals not allowed
        });
      expect(statusCode2).toBe(400);
      expect(body2).toHaveProperty('message', 'bad request');
      const { statusCode: statusCode3, body: body3 } = await request(app)
        .patch('/api/comments/1')
        .send({}); // empty request body not allowed
      expect(statusCode3).toBe(400);
      expect(body3).toHaveProperty('message', 'bad request');
    });
    test("404: responds with a 404 status and a message of 'resource not found' when no article exists with given `id`", async () => {
      const { statusCode, body } = await request(app).patch('/api/comments/424242').send({
        inc_votes: 1,
      });
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty('message', 'resource not found');
    });
  });
  describe('DELETE /api/comments/:id (DELETE ONE)', () => {
    test('204: responds with a status of 204 and an empty response body having successfully deleted a comment with a given `id`', async () => {
      const { statusCode, body } = await request(app).delete('/api/comments/1');
      expect(statusCode).toBe(204);
      expect(body).toEqual({});
    });
    test("400: responds with a 400 status and a message of 'bad request' when passed an invalid `id` parameter", async () => {
      const { statusCode, body } = await request(app).delete('/api/comments/one');
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
    test("404: responds with a 404 status and a message of 'resource not found' when no article exists with given `id`", async () => {
      const { statusCode, body } = await request(app).delete('/api/comments/4242424');
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty('message', 'resource not found');
    });
  });
});

// ====================================
//  Users
// ====================================

describe('/api/users', () => {
  describe('GET /api/users (READ ALL)', () => {
    test('200: responds with an object having a key of `users` and value that is an array containing all users', async () => {
      const { statusCode, body } = await request(app).get('/api/users');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('users');
      const { users } = body;
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(4);
      for (const user of users) {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      }
    });
  });
  describe('GET /api/users/:username (READ ONE)', () => {
    test('200: responds with an object having a key of `user` and value that is a user object with the given `username` field', async () => {
      const { statusCode, body } = await request(app).get('/api/users/icellusedkars');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('user');
      const { user } = body;
      expect(user).toMatchObject({
        username: 'icellusedkars',
        name: 'sam',
        avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      });
    });
    test("400: responds with a 400 status and a message of 'bad request' when passed an invalid `username` parameter", async () => {
      const { statusCode, body } = await request(app).get('/api/users/an%20invalid%20username');
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('message', 'bad request');
    });
    test("404: responds with a 404 status and a message of 'resource not found' when no user exists with given `username`", async () => {
      const { statusCode, body } = await request(app).get('/api/users/notarealuser');
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty('message', 'resource not found');
    });
  });
});
