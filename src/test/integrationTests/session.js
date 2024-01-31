const request = require('supertest');
const app = require('../../app'); // Update the path accordingly
const setupTestDB = require('../utils/setupTestDb');
const { admin, userOne, insertUsers } = require('../utils/user.util');
const { adminAccessToken, userAccessToken } = require('../utils/tokenUtil');
const { createSession, deleteSession } = require('../utils/session.util');

setupTestDB();

describe('Session Tests', () => {
  beforeEach(async () => {
    await insertUsers([admin, userOne]);
  });

  describe('GET /sessions', () => {
    it('should get a list of sessions', async () => {
      const response = await request(app)
        .get('/sessions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('POST /sessions', () => {
    it('should create a new session with valid token', async () => {
      const newSession = {
        moduleName: 'Test Session',
        expirationDate: '2024-12-31T23:59:59Z',
      };

      const response = await request(app)
        .post('/sessions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newSession)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('moduleName', newSession.moduleName);
      expect(response.body).toHaveProperty(
        'expirationDate',
        newSession.expirationDate
      );
    });

    it('should return 400 for duplicate session name', async () => {
      const existingSession = await createSession({
        moduleName: 'Existing Session',
        expirationDate: '2024-12-31T23:59:59Z',
      });

      const duplicateSession = {
        moduleName: 'Existing Session',
        expirationDate: '2024-12-31T23:59:59Z',
      };

      await request(app)
        .post('/sessions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(duplicateSession)
        .expect(400);
    });

    it('should return 401 for creating session without admin privileges', async () => {
      const newSession = {
        moduleName: 'Test Session',
        expirationDate: '2024-12-31T23:59:59Z',
      };

      await request(app)
        .post('/sessions')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(newSession)
        .expect(401);
    });
  });

  describe('GET /sessions/:id', () => {
    it('should get details of a specific session with valid token', async () => {
      const createdSession = await createSession({
        moduleName: 'Test Session',
        expirationDate: '2024-12-31T23:59:59Z',
      });

      const response = await request(app)
        .get(`/sessions/${createdSession._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(200);

      expect(response.body).toHaveProperty('_id', createdSession._id.toString());
      expect(response.body).toHaveProperty(
        'moduleName',
        createdSession.moduleName
      );
      expect(response.body).toHaveProperty(
        'expirationDate',
        createdSession.expirationDate.toISOString()
      );
    });

    it('should return 401 for getting session details without admin privileges', async () => {
      const createdSession = await createSession({
        moduleName: 'Test Session',
        expirationDate: '2024-12-31T23:59:59Z',
      });

      await request(app)
        .get(`/sessions/${createdSession._id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send()
        .expect(401);
    });

    it('should return 404 for getting details of non-existing session', async () => {
      const nonExistingId = '603f6e551c79c00becfbdafd'; // A non-existing session ID
      await request(app)
        .get(`/sessions/${nonExistingId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(404);
    });
  });

  describe('POST /sessions/:id/music', () => {
    it('should add music to a session with valid token', async () => {
      const createdSession = await createSession({
        moduleName: 'Test Session',
        expirationDate: '2024-12-31T23:59:59Z',
      });

      const response = await request(app)
        .post(`/sessions/${createdSession._id}/music`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          musicId: 'some-valid-music-id', // Replace with an actual music ID
        })
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Music added added');
    });

    it('should return 401 for adding music without admin privileges', async () => {
      const createdSession = await createSession({
        moduleName: 'Test Session',
        expirationDate: '2024-12-31T23:59:59Z',
      });

      await request(app)
        .post(`/sessions/${createdSession._id}/music`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          musicId: 'some-valid-music-id', // Replace with an actual music ID
        })
        .expect(401);
    });

    it('should return 404 for adding music to non-existing session', async () => {
      const nonExistingId = '603f6e551c79c00becfbdafd'; // A non-existing session ID
      await request(app)
        .post(`/sessions/${nonExistingId}/music`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          musicId: 'some-valid-music-id', // Replace with an actual music ID
        })
        .expect(404);
    });

    // Add more tests as needed for different scenarios
  });

  describe('DELETE /sessions/:id', () => {
    it('should delete a session with valid token', async () => {
      const createdSession = await createSession({
        moduleName: 'Test Session',
        expirationDate: '2024-12-31T23:59:59Z',
      });

      await request(app)
        .delete(`/sessions/${createdSession._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(200);

      const deletedSession = await request(app)
        .get(`/sessions/${createdSession._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(404);
    });

    it('should return 401 for deleting session without admin privileges', async () => {
      const createdSession = await createSession({
        moduleName: 'Test Session',
        expirationDate: '2024-12-31T23:59:59Z',
      });

      await request(app)
        .delete(`/sessions/${createdSession._id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send()
        .expect(401);
    });

    it('should return 404 for deleting non-existing session', async () => {
      const nonExistingId = '603f6e551c79c00becfbdafd'; // A non-existing session ID
      await request(app)
        .delete(`/sessions/${nonExistingId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(404);
    });
  });
});
