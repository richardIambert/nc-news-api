import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import endpointsJSON from '../endpoints.json';

describe('Resource not found', () => {
  test("404: Responds with a 404 status and message of 'resource not found' when requesting an endpoint that doesn't exist", async () => {
    const response = await request(app).get('/this/route/does/not/exist');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('resource not found');
  });
});
describe('GET /api', () => {
  test('200: Responds with an object detailing the documentation for each endpoint', async () => {
    const response = await request(app).get('/api');
    expect(response.statusCode).toBe(200);
    expect(response.body.endpoints).toEqual(endpointsJSON);
  });
});
