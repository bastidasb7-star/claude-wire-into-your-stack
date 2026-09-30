const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server');
const store = require('../db/store');

test('GET /products returns the seeded list', async () => {
  store.reset();
  const res = await request(app).get('/products');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.length, 2);
  assert.strictEqual(res.body[0].name, 'Laptop');
  assert.strictEqual(res.body[1].name, 'Phone');
});

test('GET /products/:id returns 404 for a missing product', async () => {
  store.reset();
  const res = await request(app).get('/products/999');
  assert.strictEqual(res.status, 404);
  assert.deepStrictEqual(res.body, { error: 'Product not found' });
});

test('POST /products creates a product', async () => {
  store.reset();
  const res = await request(app)
    .post('/products')
    .send({ name: 'Tablet', price: 449 });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.name, 'Tablet');
  assert.strictEqual(res.body.price, 449);
  assert.ok(res.body.id);
});

test('PUT /products/:id updates an existing product', async () => {
  store.reset();
  const res = await request(app)
    .put('/products/1')
    .send({ name: 'Gaming Laptop', price: 1299 });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.name, 'Gaming Laptop');
  assert.strictEqual(res.body.price, 1299);
});

test('PUT /products/:id returns 404 for a missing product', async () => {
  store.reset();
  const res = await request(app)
    .put('/products/999')
    .send({ name: 'Test', price: 100 });
  assert.strictEqual(res.status, 404);
  assert.deepStrictEqual(res.body, { error: 'Product not found' });
});
