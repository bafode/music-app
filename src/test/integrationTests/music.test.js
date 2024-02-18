const request = require('supertest');
const express = require('express');
const app = express();

const Music = require('../../api/models/musicModel'); // Import the Music model
const setupTestDB = require('../utils/setupTestDb');
const routes = require('../../api/routes/musicRoute'); // Import the routes

const authMiddleware = require('../../api/middleware/authMiddleware');

// Set up the server and routes
const server = express();
server.use(express.json());
routes(server);

// Mock music data
const mockMusicData = [
  {
    title: 'Song 1',
    artist: ['Artist 1'],
    link: 'https://example.com/song1',
    votes: [], // Update to match schema
    rating: 0,
    numVote: 0,
  },
  {
    title: 'Song 2',
    artist: ['Artist 2'],
    link: 'https://example.com/song2',
    votes: [],
    rating: 0,
    numVote: 0,
  },
  // Add more mock data as needed
];

const mockUser = {
  _id: 'mockuserid123', // Mock user ID
  name: 'Test User',
  email: 'test@example.com',
};

// Mock auth middleware function to simulate authentication
jest.mock('../../api/middleware/authMiddleware', () => ({
  protect: jest.fn((req, res, next) => {
    req.user = mockUser; // Set the user in request object
    next(); // Call next middleware
  }),
}));

// Before running tests, set up the test database
setupTestDB();

describe('Music Routes', () => {
  let createdMusicId; 
  // Test for the createAMusiic endpoint
  describe('POST /musics', () => {
    it('should create a new music', async () => {
      const newMusicData = mockMusicData[0]; 

      const response = await request(server)
        .post('/musics')
        .send(newMusicData)
        .expect(201);

      // Check if the response contains the created music
      expect(response.body).toMatchObject(newMusicData);

      // Check if the created music exists in the database
      const createdMusic = await Music.findOne({ title: newMusicData.title });
      expect(createdMusic).toBeTruthy();
    });

    it('should return 401 if user is not authenticated', async () => {
      // Mock the auth middleware to simulate unauthenticated user
      authMiddleware.protect.mockImplementationOnce((req, res, next) => {
        res.sendStatus(401); // Send 401 Unauthorized status
      });

      await request(server)
        .post('/musics')
        .send(mockMusicData[0])
        .expect(401);
    });
  });
  
  describe('GET /musics', () => {
    beforeEach(async () => {
      await Music.create(mockMusicData);
    });
  
    it('should get all music', async () => {
      const response = await request(server)
        .get('/musics')
        .expect(200);
  
      expect(response.body.musics).toHaveLength(mockMusicData.length);
  
      // Check specific properties of each music
      for (let i = 0; i < mockMusicData.length; i++) {
        expect(response.body.musics[i].title).toBe(mockMusicData[i].title);
        expect(response.body.musics[i].artist).toEqual(mockMusicData[i].artist);
        expect(response.body.musics[i].link).toBe(mockMusicData[i].link);
      }
    });
  });
  

  describe('GET /musics/top', () => {
    beforeEach(async () => {
      mockMusicData[0].rating = 5; 
      mockMusicData[0].numVote = 2; 
      await Music.create(mockMusicData);
    });
  
    it('should get top-rated musics', async () => {
      const response = await request(server)
        .get('/musics/top')
        .expect(200);
  
      expect(response.body).toHaveLength(mockMusicData.length);
      console.log(mockMusicData);
      console.log(response.body);
  
      // Check specific properties of the first music item
      expect(response.body[0].title).toBe('Song 1');
      expect(response.body[0].artist).toEqual(mockMusicData[0].artist);
      expect(response.body[0].link).toBe(mockMusicData[0].link);
      expect(response.body[0].rating).toBe(5);
      expect(response.body[0].numVote).toBe(2);
    });
  });

  describe('GET /musics/{id}', () => {
    beforeEach(async () => {
      const newMusicData = mockMusicData[0]; 
      const response = await request(server)
        .post('/musics') // Assuming there's a route to create music
        .send(newMusicData)
        .expect(201);

      // Extract the ID from the response body
      createdMusicId = response.body._id;
    });

    it('should get a music by ID', async () => {
      const response = await request(server)
        .get(`/musics/${createdMusicId}`)
        .expect(200);
  
      // Assert specific properties of the retrieved music
      expect(response.body.title).toBe('Song 1');
      expect(response.body.artist).toEqual(['Artist 1']);
      expect(response.body.link).toBe('https://example.com/song1');
    });
  
    it('should return 404 if music is not found', async () => {
      const nonExistentId = '5f4a3e68c09a1e45fd105999'; // Non-existent ID
      await request(server)
        .get(`/musics/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PUT /musics/{id}', () => {
    
    beforeEach(async () => {
      const newMusicData = mockMusicData[0];
      const response = await request(server)
        .post('/musics') // Assuming there's a route for creating music
        .send(newMusicData)
        .expect(201); // Assuming 201 is the status code for successful creation

      // Retrieve the created music ID from the response body
      createdMusicId = response.body._id;
    });

    it('should update a music by ID', async () => {
      const updatedMusicData = {
        title: 'Updated Song',
        artist: ['Updated Artist'],
        link: 'https://example.com/updated',
      };

      const response = await request(server)
        .put(`/musics/${createdMusicId}`)
        .send(updatedMusicData)
        .expect(200);

      // Assert specific properties of the updated music
      expect(response.body.title).toBe('Updated Song');
      expect(response.body.artist).toEqual(['Updated Artist']);
      expect(response.body.link).toBe('https://example.com/updated');
    });

    it('should return 404 if music is not found', async () => {
      const nonExistentId = '5f4a3e68c09a1e45fd105999'; // Non-existent ID
      await request(server)
        .put(`/musics/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('DELETE /musics/{id}', () => {
  let createdMusicId; // Variable to store the created music ID

  beforeEach(async () => {
    const newMusicData = mockMusicData[0];
    const response = await request(server)
      .post('/musics') // Assuming there's a route for creating music
      .send(newMusicData)
      .expect(201); // Assuming 201 is the status code for successful creation

    // Retrieve the created music ID from the response body
    createdMusicId = response.body._id;
  });

  it('should delete a music by ID', async () => {
    await request(server)
      .delete(`/musics/${createdMusicId}`) // Use the ID of the created music
      .expect(200);

    // Assert that the music is deleted
    const deletedMusic = await Music.findById(createdMusicId);
    expect(deletedMusic).toBeNull();
  });

  it('should return 404 if music is not found', async () => {
    const nonExistentId = '5f4a3e68c09a1e45fd105999'; // Non-existent ID
    await request(server)
      .delete(`/musics/${nonExistentId}`)
      .expect(404);
  });
});


  
  
});
