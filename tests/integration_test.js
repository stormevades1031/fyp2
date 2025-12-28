const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');

describe('End-to-End Security', () => {
  // Setup test database connection
  beforeAll(async () => {
    const testMongoUri = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/digital_type_assessment_test';
    await mongoose.connect(testMongoUri);
  }, 30000); // 30 second timeout for connection

  // Clean up after each test
  afterEach(async () => {
    // Clear test data
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  // Close database connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  it('should prevent NoSQL injection in complete user flow', async () => {
    // 1. Try malicious registration
    const maliciousUser = {
      name: { $ne: null },
      email: 'test@example.com',
      password: 'Password123!',
      digitalType: 'INTJ'
    };

    await request(app)
      .post('/api/auth/register')
      .send(maliciousUser)
      .expect(400);

    // 2. Register legitimate user
    const validUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      digitalType: 'INTJ'
    };

    await request(app)
      .post('/api/auth/register')
      .send(validUser)
      .expect(201);

    // 3. Try malicious login
    const maliciousLogin = {
      email: { $regex: 'test@.*' },
      password: 'Password123!'
    };

    await request(app)
      .post('/api/auth/login')
      .send(maliciousLogin)
      .expect(400);

    // 4. Legitimate login should work
    const validLogin = {
      email: 'test@example.com',
      password: 'Password123!'
    };

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send(validLogin)
      .expect(200);

    expect(loginResponse.body.user).toBeDefined();
  }, 15000); // 15 second timeout for this test
});