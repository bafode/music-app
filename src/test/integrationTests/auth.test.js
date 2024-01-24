const request= require("supertest")
const User=require('../../api/models/userModel')
const app=require('../../app')
const setupTestDB=require('../utils/setupTestDb')


setupTestDB()

describe('POST /users (register)', () => {

    const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
      };
   
    it('should register a new user and return user details with a token', async () => {
      
  
      const response = await request(app)
        .post('/users')
        .send(newUser)
        .expect(201);
  
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('isAdmin', false);
      expect(response.body).toHaveProperty('token');
    });
  
    it('should return 400 for duplicate email during registration', async () => {
      // Add a user with the same email before running the test
      const existingUser = new User({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'existingpassword',
      });
  
      await existingUser.save();
  
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
      // Assuming you have a test user in your database
      const testUser = {
        email: 'test@example.com',
        password: 'testpassword',
      };
  
  
      const response = await request(app)
        .post('/users/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);
  
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('isAdmin');
      expect(response.body).toHaveProperty('token');
    });
  
    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({ email: 'nonexistent@example.com', password: 'wrongPassword' })
        .expect(401);
  
      expect(response.body).toEqual({ message: 'Invalid email or password' });
    });
  
    // Add more test cases as needed for error handling, edge cases, etc.
  });