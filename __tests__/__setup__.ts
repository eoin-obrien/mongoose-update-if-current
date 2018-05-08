import * as mongoose from 'mongoose';
import { isNullOrUndefined } from 'util';
import { updateIfCurrentPlugin } from '../src';

// Configure mongoose to use the global promise library
(<any>mongoose).Promise = Promise;

// Connect to MongoDB before testing
beforeAll(async () => {
  const mongoDbUri: string = `mongodb://localhost/mongoose-update-if-current`;
  const connectionOptions: mongoose.ConnectionOptions = {
    socketTimeoutMS: 360000,
    keepAlive: 30000,
    reconnectTries: 30,
  };
  await mongoose.connect(mongoDbUri, connectionOptions);
});

// Drop database and disconnect from MongoDB after testing
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
