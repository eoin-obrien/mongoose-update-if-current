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

function getModel(name: string, versionKey?: string | boolean): mongoose.Model<any> {
  // Create a simple schema
  const schema = new mongoose.Schema({
    name: String,
  });

  // Customise version key if one is supplied
  if (!isNullOrUndefined(versionKey)) {
    schema.set('versionKey', versionKey);
  }

  // Plugin
  schema.plugin(updateIfCurrentPlugin);

  // Build model
  return mongoose.model(name, schema);
}

describe('updateIfCurrentPlugin', () => {
  it('should manage concurrency when saving documents', async () => {
    const Model = getModel('Model');

    // Should save a new document
    const firstVersion = await new Model({ name: 'New Document' }).save();
    expect(firstVersion.__v).toBe(0);

    // Should increment the version number when saving an update
    let secondVersion = new Model(firstVersion);
    secondVersion.name = 'Updated Document';
    secondVersion = await secondVersion.save();
    expect(secondVersion.__v).toBe(1);

    // Should fail when saving an earlier version over a later version
    const thirdVersion = new Model(firstVersion);
    thirdVersion.name = 'Concurrency Problem Document';
    await expect(thirdVersion.save()).rejects.toBeInstanceOf(mongoose.Error);
  });

  it('should handle documents with custom version keys', async () => {
    const Model = getModel('CustomVersionModel', '_version');

    // Should save a new document
    const document = await new Model({ name: 'Custom Version Document' }).save();
    expect(document._version).toBe(0);
  });

  it('should handle documents with disabled version keys', async () => {
    const Model = getModel('DisabledVersionModel', false);

    // Should save a new document
    const document = await new Model({ name: 'Disabled Version Document' }).save();
    expect(document.__v).toBe(0);
  });
});
