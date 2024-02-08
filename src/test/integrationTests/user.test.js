const request = require('supertest');
const express = require('express');
const app = express();

const User = require('../../api/models/userModel');
const setupTestDB = require('../utils/setupTestDb');
const authMiddleware = require('../../api/middleware/authMiddleware');

const server = express();
server.use(express.json());
const routes = require('../../api/routes/userRoute');
routes(server);

const mockUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'testpassword',
  isAdmin: false,
};

setupTestDB();

describe('User Routes', () => {
  describe('POST /users (register)', () => {
    it('should register a new user and return user details with a token', async () => {
      const response = await request(server)
        .post('/users')
        .send(mockUser)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', mockUser.name);
      expect(response.body).toHaveProperty('email', mockUser.email);
      expect(response.body).toHaveProperty('isAdmin', false);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 400 if user data is incomplete', async () => {
      const incompleteUserData = {
        name: 'Incomplete User',
      };

      const response = await request(server)
        .post('/users')
        .send(incompleteUserData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Incomplete user data');
    });

    it('should return 400 if user already exists', async () => {
      await User.create(mockUser);

      const response = await request(server)
        .post('/users')
        .send(mockUser)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /users/login (login)', () => {
    beforeEach(async () => {
      await User.create(mockUser);
    });

    it('should login a user with valid credentials', async () => {
      const response = await request(server)
        .post('/users/login')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', mockUser.name);
      expect(response.body).toHaveProperty('email', mockUser.email);
      expect(response.body).toHaveProperty('isAdmin', mockUser.isAdmin);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 if login credentials are invalid', async () => {
      const invalidCredentials = {
        email: 'invalid@example.com',
        password: 'invalidpassword',
      };

      await request(server)
        .post('/users/login')
        .send(invalidCredentials)
        .expect(401);
    });
  });

  describe('GET /users (getUsers)', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpassword',
        isAdmin: true,
      });
    });

    it('should get all users with a valid admin token', async () => {
      const loginResponse = await request(server)
        .post('/users/login')
        .send({
          email: 'admin@example.com',
          password: 'adminpassword',
        })
        .expect(200);

      const adminToken = loginResponse.body.token;

      const response = await request(server)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('_id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
      expect(response.body[0]).toHaveProperty('isAdmin');
    });

    it('should return 403 if a non-admin token is used', async () => {
      await request(server)
        .get('/users')
        .set('Authorization', 'Bearer regularUserMockToken')
        .expect(403);
    });
  });

  describe('GET /users/:id', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpassword',
        isAdmin: true,
      });
    });

    it('should get a user by ID', async () => {
      const adminUser = await User.findOne({ email: 'admin@example.com' });
      const loginResponse = await request(server)
        .post('/users/login')
        .send({
          email: 'admin@example.com',
          password: 'adminpassword',
        })
        .expect(200);

      const adminToken = loginResponse.body.token;

      const response = await request(server)
        .get(`/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', adminUser._id.toString());
      expect(response.body).toHaveProperty('name', adminUser.name);
      expect(response.body).toHaveProperty('email', adminUser.email);
      expect(response.body).toHaveProperty('isAdmin', true);
    });

    it('should return 404 if user is not found', async () => {
      const loginResponse = await request(server)
        .post('/users/login')
        .send({
          email: 'admin@example.com',
          password: 'adminpassword',
        })
        .expect(200);

      const adminToken = loginResponse.body.token;

      const nonExistingUserId = '60c9ef7f8b9d93001418f0e9';
      const response = await request(server)
        .get(`/users/${nonExistingUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('PUT /users/:id (updateUser)', () => {
    let adminUser;
    let adminToken;

    beforeEach(async () => {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpassword',
        isAdmin: true,
      });

      const loginResponse = await request(server)
        .post('/users/login')
        .send({
          email: 'admin@example.com',
          password: 'adminpassword',
        })
        .expect(200);

      adminToken = loginResponse.body.token;
    });

    it('should update a user by ID with valid token', async () => {
      const updatedUserData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'updatedpassword',
        isAdmin: false,
      };

      const response = await request(server)
        .put(`/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedUserData)
        .expect(200);
    });

    it('should return 404 if user ID is not found', async () => {
      const nonExistingUserId = '60c9ef7f8b9d93001418f0e9';
      const response = await request(server)
        .put(`/users/${nonExistingUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(404);

      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('DELETE /users/:id (deleteUser)', () => {
    let adminUser;
    let adminToken;

    beforeEach(async () => {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpassword',
        isAdmin: true,
      });

      const loginResponse = await request(server)
        .post('/users/login')
        .send({
          email: 'admin@example.com',
          password: 'adminpassword',
        })
        .expect(200);

      adminToken = loginResponse.body.token;
    });

    it('should delete a user by ID with valid token', async () => {
      const response = await request(server)
        .delete(`/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('should return 404 if user ID is not found', async () => {
      const nonExistingUserId = '60c9ef7f8b9d93001418f0e9';
      const response = await request(server)
        .delete(`/users/${nonExistingUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });
});
