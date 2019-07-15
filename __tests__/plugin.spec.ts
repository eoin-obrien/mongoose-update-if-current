import * as mongoose from 'mongoose';
import { isNullOrUndefined } from 'util';
import { updateIfCurrentPlugin } from '../src';

// Install plugin
mongoose.plugin(updateIfCurrentPlugin);


function getModel(name: string, versionKey?: string | boolean): mongoose.Model<any> {
  // Create a simple schema
  const schema = new mongoose.Schema({
    name: String,
  });

  // Customise version key if one is supplied
  if (!isNullOrUndefined(versionKey)) {
    schema.set('versionKey', versionKey);
  }

  // Build model
  return mongoose.model(name, schema);
}

describe('Document#save()', () => {

  it('should manage concurrency when saving documents', async () => {
    const model = getModel('PlainVersionModel');

    // Should save a new document
    const firstVersion = await new model({ name: 'New Document' }).save();
    expect(firstVersion.__v).toBe(0);

    // Should increment the version number when saving an update
    let secondVersion = new model(firstVersion);
    secondVersion.name = 'Updated Document';
    secondVersion = await secondVersion.save();
    expect(secondVersion.__v).toBe(1);

    // Should fail when saving an earlier version over a later version
    const thirdVersion = new model(firstVersion);
    thirdVersion.name = 'Concurrency Problem Document';
    await expect(thirdVersion.save()).rejects.toBeInstanceOf(mongoose.Error);
  });

  it('should handle documents with custom version keys', async () => {
    const model = getModel('CustomVersionModel', '_version');

    // Should save a new document
    const document = await new model({ name: 'Custom Version Document' }).save();
    expect(document._version).toBe(0);
  });

  it('should handle documents with disabled version keys', async () => {
    const model = getModel('DisabledVersionModel', false);

    // Should save a new document
    const document = await new model({ name: 'Disabled Version Document' }).save();
    expect(document.__v).toBe(0);
  });

});
