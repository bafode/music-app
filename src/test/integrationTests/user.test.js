const request = require('supertest');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const User = require('../../api/models/userModel');
const userController = require('../../api/controllers/userController');
const setupTestDB = require('../utils/setupTestDb');

const authMiddleware = {
  protect: (req, res, next) => {
    req.user = {
      _id: 'mockUserId',
      isAdmin: false, 
    };
    next();
  },
  admin: (req, res, next) => {
    const token = req.headers.authorization;
    if (token && token === 'Bearer adminMockToken') {
      next(); 
    } else {
      res.status(401);
      throw new Error('Not authorized as an admin');
    }
  },
};



const server = express();
server.use(express.json());
const routes = require('../../api/routes/userRoute');
routes(server);

const mockUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'testpassword',
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
      
      await request(server)
        .post('/users')
        .send(mockUser)
        .expect(201);
      
      const response = await request(server)
        .post('/users')
        .send(mockUser)
        .expect(400); 
  
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });
  
  

  describe('POST /users/login (login)', () => {

    beforeEach(async () => {
      
      await request(server)
        .post('/users')
        .send(mockUser)
        .expect(201);
    });
  
    it('should login a user with valid credentials', async () => {
      const response = await request(server)
        .post('/users/login')
        .send({
          name: mockUser.name,
          email: mockUser.email,
          password: mockUser.password,
        })
        .expect(200);
    
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', mockUser.name);
      expect(response.body).toHaveProperty('email', mockUser.email);
      expect(response.body).toHaveProperty('isAdmin', false);
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
      // Register an admin user in the database before each test
      const response = await request(server)
        .post('/users')
        .send({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'adminpassword',
          isAdmin: true, // Make the user an admin
        })
        .expect(201);
    
    
      // Set the admin token for the admin check
      authMiddleware.admin = (req, res, next) => {
        const token = req.headers.authorization;
        if (token && token === `Bearer ${response.body.token}`) {
          adminToken = token; 
          next();
        } else {
          res.status(401);
          throw new Error('Not authorized as an admin');
        }
      };
    });
    
  
    it('should get all users with a valid admin token', async () => {
      
      const adminCredentials = {
        email: 'admin@example.com',
        password: 'adminpassword',
        isAdmin: true,
      };
  
      const loginResponse = await request(server)
        .post('/users/login')
        .send(adminCredentials)
        .expect(200);
  
      const adminToken = loginResponse.body.token;
  
      // Request a GET to the '/users' endpoint with the admin token
      const response = await request(server)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
  
      console.log(response.body); 
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
    
  describe('GET /users/{id}', () => {
    let adminToken;
    let testUserId; 

    console.log('1')
  
    beforeEach(async () => {
     
      const userToRegister = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpassword',
      };
  
      // Register the user
      const registerResponse = await request(app)
        .post('/users')
        .send(userToRegister)
        .expect(201);
  
      console.log('Created 1 user:', response.body);
  
      // Save the registered user's ID
      testUserId = registerResponse.body._id;
  
      // Log in as an admin to obtain the admin token
      const adminCredentials = {
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'adminpassword',
          isAdmin: true,
      };
  
      const loginResponse = await request(app)
        .post('/users/login')
        .send(adminCredentials)
        .expect(200);
  
      console.log('Created 1 user:', Response.body);
      adminToken = loginResponse.body.token;
    });
  
    it('should get a user by ID with a valid admin token', async () => {
      // Request a GET to the `/users/{id}` endpoint with the admin token
      const response = await request(app)
        .get(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
  
      console.log(response.body); 
  
      expect(response.body).toHaveProperty('_id', testUserId);
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('email', 'testuser@example.com');
      expect(response.body).toHaveProperty('isAdmin', false);
    });
  
    it('should return 404 if user is not found', async () => {
      // Assuming an invalid user ID for testing the 404 scenario
      const invalidUserId = 'invalidUserId';
  
      // Request a GET to the `/users/{id}` endpoint with the admin token
      const response = await request(app)
        .get(`/users/${invalidUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
  
      console.log(response.body); // Log the response for inspection
  
      
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });
  

  

  describe('PUT /users/:id (updateUser)', () => {
    it('should update a user by ID with valid token', async () => {
      const newUser = await User.create(mockUser);

      const updatedUserData = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      const response = await request(server)
        .put(`/users/${newUser._id}`)
        .set('Authorization', 'Bearer mockToken')
        .send(updatedUserData)
        .expect(200);

      expect(response.body).toHaveProperty('_id', newUser._id.toString());
      expect(response.body).toHaveProperty('name', updatedUserData.name);
      expect(response.body).toHaveProperty('email', updatedUserData.email);
      expect(response.body).toHaveProperty('isAdmin', false);
    });

    it('should return 404 if user ID is not found', async () => {
      const nonExistingUserId = 'nonexistinguserid';

      await request(server)
        .put(`/users/${nonExistingUserId}`)
        .set('Authorization', 'Bearer mockToken')
        .expect(404);
    });
  });

  describe('DELETE /users/:id (deleteUser)', () => {
    it('should delete a user by ID with valid token', async () => {
      const newUser = await User.create(mockUser);

      await request(server)
        .delete(`/users/${newUser._id}`)
        .set('Authorization', 'Bearer mockToken')
        .expect(200);

      const deletedUser = await User.findById(newUser._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 if user ID is not found', async () => {
      const nonExistingUserId = 'nonexistinguserid';

      await request(server)
        .delete(`/users/${nonExistingUserId}`)
        .set('Authorization', 'Bearer mockToken')
        .expect(404);
    });
  });

 
});
