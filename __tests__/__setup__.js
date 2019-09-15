import 'core-js/stable';
import 'regenerator-runtime/runtime';

import mongoose from 'mongoose';
import uuidv4 from 'uuid/v4';

// Configure mongoose to use the global promise library
mongoose.Promise = Promise;

// Connect to MongoDB before testing
beforeAll(async () => {
  // Connect to a unique database per test script
  const mongoDbUri = 'mongodb://localhost/mongoose-update-if-current-' + uuidv4();
  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(mongoDbUri, connectionOptions);
});

// Drop database and disconnect from MongoDB after testing
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
