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
  });
});
