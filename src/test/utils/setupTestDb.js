const mongoose= require('mongoose')

const setupTestDB = () => {
  beforeAll(async () => {
      // Close existing connection if any
      await mongoose.disconnect();

      // Connect to the test database
      await mongoose.connect("mongodb://mongo/apiMusicNodeTest");
  });

  beforeEach(async () => {
      // Your setup logic for each test
      await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany({})));
  });

  afterAll(async () => {
      // Close the connection after all tests are done
      await mongoose.disconnect();
  });
};
  module.exports= setupTestDB