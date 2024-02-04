const request = require('supertest');
const app = require('../../app'); // Update the path accordingly
const setupTestDB = require('../utils/setupTestDb');
const { userOne, admin, insertUsers } = require('../utils/user.util');
const Music = require('../../api/models/musicModel');

setupTestDB();

describe('Music Tests', () => {
  beforeEach(async () => {
    await insertUsers([admin, userOne]);
  });

  describe('GET /musics', () => {
    it('should get a list of musics', async () => {
      const response = await request(app)
        .get('/musics')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send()
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('POST /musics', () => {
    it('should create a new music', async () => {
      const newMusic = {
        title: 'New Song',
        artist: 'New Artist',
        link: 'https://example.com/new-song',
      };

      const response = await request(app)
        .post('/musics')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newMusic)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('title', newMusic.title);
      expect(response.body).toHaveProperty('artist', newMusic.artist);
      expect(response.body).toHaveProperty('link', newMusic.link);
    });
  });

  describe('GET /musics/:id', () => {
    it('should get details of a specific music', async () => {
      const existingMusic = await Music.findOne();
      const response = await request(app)
        .get(`/musics/${existingMusic._id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send()
        .expect(200);

      expect(response.body).toHaveProperty('_id', existingMusic._id.toString());
    });

    it('should return 404 for non-existing music', async () => {
      const nonExistingId = '603f6e551c79c00becfbdafd'; // A non-existing music ID
      await request(app)
        .get(`/musics/${nonExistingId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send()
        .expect(404);
    });
  });

  describe('PUT /musics/:id', () => {
    it('should update details of a specific music', async () => {
      const existingMusic = await Music.findOne();
      const updatedMusicDetails = {
        title: 'Updated Song',
        artist: 'Updated Artist',
        link: 'https://example.com/updated-song',
      };

      const response = await request(app)
        .put(`/musics/${existingMusic._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedMusicDetails)
        .expect(200);

      expect(response.body).toHaveProperty('_id', existingMusic._id.toString());
      expect(response.body).toHaveProperty('title', updatedMusicDetails.title);
      expect(response.body).toHaveProperty('artist', updatedMusicDetails.artist);
      expect(response.body).toHaveProperty('link', updatedMusicDetails.link);
    });

    it('should return 404 for updating non-existing music', async () => {
      const nonExistingId = '603f6e551c79c00becfbdafd'; // A non-existing music ID
      await request(app)
        .put(`/musics/${nonExistingId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ title: 'Updated Song' })
        .expect(404);
    });
  });

  describe('DELETE /musics/:id', () => {
    it('should delete a specific music', async () => {
      const existingMusic = await Music.findOne();
      await request(app)
        .delete(`/musics/${existingMusic._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(200);
    });

    it('should return 404 for deleting non-existing music', async () => {
      const nonExistingId = '603f6e551c79c00becfbdafd'; // A non-existing music ID
      await request(app)
        .delete(`/musics/${nonExistingId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(404);
    });
  });
});
