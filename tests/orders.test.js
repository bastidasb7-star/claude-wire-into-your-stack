const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server');
const store = require('../db/store');

test('GET /orders returns the seeded list', async () => {
  store.reset();
  const res = await request(app).get('/orders');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.length, 2);
  assert.strictEqual(res.body[0].userId, 1);
  assert.strictEqual(res.body[0].productId, 1);
});

test('GET /orders/:id returns 404 for a missing order', async () => {
  store.reset();
  const res = await request(app).get('/orders/999');
  assert.strictEqual(res.status, 404);
  assert.deepStrictEqual(res.body, { error: 'Order not found' });
});

test('POST /orders creates an order', async () => {
  store.reset();
  const res = await request(app)
    .post('/orders')
    .send({ userId: 1, productId: 2, quantity: 3 });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.userId, 1);
  assert.strictEqual(res.body.productId, 2);
  assert.strictEqual(res.body.quantity, 3);
  assert.strictEqual(res.body.status, 'pending');
  assert.ok(res.body.id);
});

test('POST /orders with custom status creates an order', async () => {
  store.reset();
  const res = await request(app)
    .post('/orders')
    .send({ userId: 2, productId: 1, quantity: 1, status: 'shipped' });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.status, 'shipped');
});

test('POST /orders returns 400 for missing userId', async () => {
  store.reset();
  const res = await request(app)
    .post('/orders')
    .send({ productId: 1, quantity: 1 });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error, 'userId, productId, and quantity are required');
});

test('POST /orders returns 400 for missing productId', async () => {
  store.reset();
  const res = await request(app)
    .post('/orders')
    .send({ userId: 1, quantity: 1 });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error, 'userId, productId, and quantity are required');
});

test('POST /orders returns 400 for missing quantity', async () => {
  store.reset();
  const res = await request(app)
    .post('/orders')
    .send({ userId: 1, productId: 1 });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error, 'userId, productId, and quantity are required');
});

test('PUT /orders/:id updates order status', async () => {
  store.reset();
  const res = await request(app)
    .put('/orders/1')
    .send({ status: 'delivered' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'delivered');
  assert.strictEqual(res.body.quantity, 2);
});

test('PUT /orders/:id updates order quantity', async () => {
  store.reset();
  const res = await request(app)
    .put('/orders/1')
    .send({ quantity: 5 });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.quantity, 5);
  assert.strictEqual(res.body.status, 'pending');
});

test('PUT /orders/:id updates both status and quantity', async () => {
  store.reset();
  const res = await request(app)
    .put('/orders/1')
    .send({ status: 'cancelled', quantity: 0 });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'cancelled');
  assert.strictEqual(res.body.quantity, 0);
});

test('PUT /orders/:id returns 404 for a missing order', async () => {
  store.reset();
  const res = await request(app)
    .put('/orders/999')
    .send({ status: 'shipped' });
  assert.strictEqual(res.status, 404);
  assert.deepStrictEqual(res.body, { error: 'Order not found' });
});

test('PUT /orders/:id returns 400 for missing status and quantity', async () => {
  store.reset();
  const res = await request(app)
    .put('/orders/1')
    .send({});
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error, 'status or quantity is required');
});
