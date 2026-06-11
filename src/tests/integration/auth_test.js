// CONFIGURACIÓN INICIAL
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');

process.env.JWT_SECRET = 'secreto_de_test';
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  const colecciones = await mongoose.connection.db.collections();
  for (const c of colecciones) await c.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// TESTS
describe('POST /api/auth/register', () => {
  it('Crea un usuario y devuelve 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'admin@test.com', password: 'test1234', rol: 'admin' });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('admin@test.com');
    expect(res.body.password).toBeUndefined();
  });

  it('Devuelve error si faltan datos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'solo@test.com' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('Devuelve token si las credenciales son correctas', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@test.com', password: 'test1234', rol: 'admin' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'test1234' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});