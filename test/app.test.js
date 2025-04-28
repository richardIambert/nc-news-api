import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import endpointsJSON from '../endpoints.json';

describe('error conditions', () => {
  describe('resource not found', () => {
    test("404: responds with a 404 status and message of 'resource not found' when requesting an endpoint that doesn't exist", async () => {
      const response = await request(app).get('/this/route/does/not/exist');
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('resource not found');
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
        });
      });
      test("400: responds with a 400 status and message of 'bad request' when passed an invalid value for the `id` parameter", async () => {
        const { statusCode, body } = await request(app).get('/api/articles/one');
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toBe('bad request');
      });
      test("404: responds with a 404 status and message of 'resource not found' when no article exists with given `id`", async () => {});
    });
  });
});
