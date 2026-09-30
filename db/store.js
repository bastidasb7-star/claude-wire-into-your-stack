// In-memory data store. Every route reads and writes through these helpers,
// so swapping in a real database later only touches this one file.

let users = [];
let products = [];
let nextUserId = 1;
let nextProductId = 1;

function seed() {
  users = [
    { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
    { id: 2, name: 'Alan Turing', email: 'alan@example.com' },
  ];
  products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 599 },
  ];
  nextUserId = 3;
  nextProductId = 3;
}
seed();

function listUsers() {
  return users;
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

function createUser({ name, email }) {
  const user = { id: nextUserId, name, email };
  nextUserId += 1;
  users.push(user);
  return user;
}

function updateUser(id, fields) {
  const user = getUser(id);
  if (!user) return undefined;
  if (fields.name !== undefined) user.name = fields.name;
  if (fields.email !== undefined) user.email = fields.email;
  return user;
}

function listProducts() {
  return products;
}

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function createProduct({ name, price }) {
  const product = { id: nextProductId, name, price };
  nextProductId += 1;
  products.push(product);
  return product;
}

function updateProduct(id, fields) {
  const product = getProduct(id);
  if (!product) return undefined;
  if (fields.name !== undefined) product.name = fields.name;
  if (fields.price !== undefined) product.price = fields.price;
  return product;
}

// Reset to the seed data. Used by the tests so each one starts clean.
function reset() {
  seed();
}

module.exports = { listUsers, getUser, createUser, updateUser, listProducts, getProduct, createProduct, updateProduct, reset };
