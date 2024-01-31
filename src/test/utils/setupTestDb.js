const mongoose = require('mongoose');

const setupTestDB = () => {
  beforeAll(async () => {
    // Close existing connection if any
    await mongoose.disconnect();

    // Connect to the test database
    await mongoose.connect("mongodb://mongo/apiMusicNodeTest", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    // Your setup logic for each test
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    // Close the connection after all tests are done
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
