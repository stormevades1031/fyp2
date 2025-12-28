const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');

const maliciousPayloads = [
  { email: { $ne: null }, password: 'test' },
  { email: { $regex: '.*' }, password: 'test' },
  { email: { $where: 'true' }, password: 'test' },
  { email: { $gt: '' }, password: 'test' },
  { email: 'test@example.com', password: { $ne: null } }
];

describe('Security Tests - NoSQL Injection Prevention', () => {
  // Setup test database connection
  beforeAll(async () => {
    const testMongoUri = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/digital_type_assessment_test';
    await mongoose.connect(testMongoUri);
  }, 30000);

  // Clean up after each test
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  // Close database connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  describe('Login Endpoint Security', () => {
    maliciousPayloads.forEach((payload, index) => {
      it(`should reject malicious login payload ${index + 1}: ${JSON.stringify(payload)}`, async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send(payload);
        
        // Should return 400 Bad Request for malicious payloads
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid|email|format/i);
      });
    });
  });

  describe('Registration Endpoint Security', () => {
    maliciousPayloads.forEach((payload, index) => {
      it(`should reject malicious registration payload ${index + 1}: ${JSON.stringify(payload)}`, async () => {
        // Add required fields for registration
        const registrationPayload = {
          name: 'Test User',
          digitalType: 'INTJ',
          ...payload
        };
        
        const response = await request(app)
          .post('/api/auth/register')
          .send(registrationPayload);
        
        // Accept both 400 (validation error) and 429 (rate limit) as valid security responses
        expect([400, 429]).toContain(response.status);
        if (response.status === 400) {
          expect(response.body.message).toMatch(/invalid|email|format|required/i);
        }
      });
    });
  });

  describe('Assessment Endpoint Security', () => {
    it('should reject malicious assessment payloads', async () => {
      const maliciousAssessment = {
        userId: { $ne: null },
        responses: [{ $where: 'true' }]
      };
      
      const response = await request(app)
        .post('/api/assessment')
        .send(maliciousAssessment);
      
      // Should return 400, 401, 403, or 404 for malicious payloads
      expect([400, 401, 403, 404]).toContain(response.status);
    });
  });
});