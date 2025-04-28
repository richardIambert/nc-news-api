import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import endpointsJSON from '../endpoints.json';

describe('GET /api', () => {
  test('200: Responds with an object detailing the documentation for each endpoint', async () => {
    const response = await request(app).get('/api');
    expect(response.statusCode).toBe(200);
    expect(response.body.endpoints).toEqual(endpointsJSON);
  });
});
