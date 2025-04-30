import { beforeEach, describe, expect, test } from 'vitest';
import db from '../src/database/connection.js';
import seed from '../src/database/seeds/seed.js';
import data from '../src/database/data/test-data/index.js';
import request from 'supertest';
import app from '../src/app.js';
import endpointsJSON from '../endpoints.json';

beforeEach(() => seed(data));

describe('error conditions', () => {
  describe('resource not found', () => {
    test("404: responds with a 404 status and message of 'resource not found' when requesting an endpoint that doesn't exist", async () => {
      const { statusCode, body } = await request(app).get('/this/route/does/not/exist');
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty('message', 'resource not found');
    });
  });
});
describe('endpoints', () => {
  describe('api', () => {
    describe('GET /api', () => {
      test('200: responds with an object detailing the documentation for each endpoint', async () => {
        const response = await request(app).get('/api');
        expect(response.statusCode).toBe(200);
        expect(response.body.endpoints).toEqual(endpointsJSON);
      });
    });
  });
  describe('topics', () => {
    describe('GET /api/topics', () => {
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
  describe('articles', () => {
    describe('GET /api/articles', () => {
      test('200: responds with an object having a key of `articles` and a value that is an array containing all articles', async () => {
        const { statusCode, body } = await request(app).get('/api/articles');
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('articles'); // does response body have an articles property?
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true); // is the articles property and array?
        expect(articles).toHaveLength(13); // does the array contain all article records?
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
        expect(articles[12].article_id).toBe(7);
        expect(articles[12].comment_count).toBe(0); // check the comment counts are correct
        expect(articles[0].comment_count).toBe(2);
      });
      test('200: query string can sort `articles` by author in ascending order', async () => {
        const { statusCode, body } = await request(app).get(
          '/api/articles?sort_by=author&order=asc'
        );
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('articles');
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(13);
        expect(articles[0].article_id).toBe(1);
        expect(articles[12].article_id).toBe(5);
      });
      test('200: query string can sort `articles` by title in ascending order', async () => {
        const { statusCode, body } = await request(app).get(
          '/api/articles?sort_by=title&order=asc'
        );
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('articles');
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(13);
        expect(articles[0].article_id).toBe(6);
        expect(articles[12].article_id).toBe(7);
      });
      test('200: query string can sort `articles` by topic in ascending order', async () => {
        const { statusCode, body } = await request(app).get(
          '/api/articles?sort_by=topic&order=asc'
        );
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('articles');
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(13);
        expect(articles[0].article_id).toBe(5);
        expect(articles[12].article_id).toBe(11);
      });
      test('200: query string can sort `articles` by vote in ascending order', async () => {
        const { statusCode, body } = await request(app).get(
          '/api/articles?sort_by=votes&order=asc'
        );
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('articles');
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(13);
        expect(articles[0].article_id).toBe(11);
        expect(articles[12].article_id).toBe(1);
      });
      test('200: query string can sort `articles` by comment_count in ascending order', async () => {
        const { statusCode, body } = await request(app).get(
          '/api/articles?sort_by=comment_count&order=asc'
        );
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('articles');
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(13);
        expect(articles[0].article_id).toBe(4);
        expect(articles[12].article_id).toBe(1);
      });
      test('200: query string can select `articles` by topic', async () => {
        const { statusCode, body } = await request(app).get('/api/articles?topic=cats');
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('articles');
        const { articles } = body;
        expect(articles).toHaveLength(1);
        expect(articles[0].article_id).toBe(5);
      });
      test("400: responds with a 400 status and message of 'bad request' when passed an invalid query string", async () => {
        const { statusCode, body } = await request(app).get(
          '/api/articles?sort_by=;DROP TABLE articles;--&order=;SELECT * FROM users;--'
        );
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('message', 'bad request');
      });
    });
    describe('GET /api/articles/:id', () => {
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
    describe('GET /api/articles/:id/comments', () => {
      test('200: responds with an object having a key of `comments` and value that is an array containing all comments for a given article', async () => {
        const { statusCode, body } = await request(app).get('/api/articles/1/comments');
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('comments');
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(11);
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
        expect(comments[10].comment_id).toBe(9);
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
    describe('POST /api/articles/:id/comments', () => {
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
    describe('PATCH /api/articles/:id', () => {
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
  });
  describe('comments', () => {
    describe('PATCH /api/comments/:id', () => {
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
    describe('DELETE /api/comments/:id', () => {
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
  describe('users', () => {
    describe('GET /api/users', () => {
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
    describe('GET /api/users/:username', () => {
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
});
