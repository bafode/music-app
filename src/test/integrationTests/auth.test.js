const request = require('supertest');
const app = require('../../app');
const setupTestDB = require('../utils/setupTestDb');
const { userOne, userTwo, admin, insertUsers } = require('../utils/user.util');
const User = require('../../api/models/userModel');

setupTestDB();

describe('Authentication Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await insertUsers([admin, userOne, userTwo]);
  });

  describe('POST /users (register)', () => {
  it('should register a new user and return user details with a token', async () => {
    const newUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/users')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('name', 'Test User');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('isAdmin', false);
    expect(response.body).toHaveProperty('token');
  });


    it('should return 400 for duplicate email during registration', async () => {
      const existingUser = {
        name: 'Existing User',
        email: 'test@example.com',
        password: 'existingpassword',
      };

      await request(app).post('/users').send(existingUser).expect(201);

      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
      };

      const response = await request(app)
        .post('/users')
        .send(newUser)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /users/login (login)', () => {
    it('should login a user with valid credentials', async () => {
      const testUser = {
        email: userOne.email,
        password: 'password1',
      };

      const response = await request(app)
        .post('/users/login')
        .send(testUser)
        .expect(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('isAdmin');
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const invalidCredentials = {
        email: 'nonexistent@example.com',
        password: 'wrongPassword',
      };

      const response = await request(app)
        .post('/users/login')
        .send(invalidCredentials)
        .expect(401);

      expect(response.body).toEqual({ message: 'Invalid email or password' });
    });
  });
});
