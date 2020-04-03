import mongoose from 'mongoose';
import {timestampOCCPlugin} from '../src/timestamp-occ-plugin';
import {AssertionError} from 'assert';

// Install plugin
mongoose.plugin(timestampOCCPlugin);

/**
 * Generate a model with an optional version key.
 *
 * @param {string} name
 * @param {boolean|object|undefined} timestamps
 *
 * @return {mongoose.Model}
 */
function getModel(name, timestamps) {
  const schema = new mongoose.Schema({
    name: String,
    nested: [{
        _id: false,
        name: String,
    }],
  });
  if (timestamps !== undefined) {
    schema.set('timestamps', timestamps);
  }
  return mongoose.model(name, schema);
}

describe('timestampOCCPlugin', () => {
  it('should implement OCC using the schema\'s timestamp fields', async () => {
    const Model = getModel('DefaultTimestampModel', true);
    const document = await new Model({name: 'New Document', nested: [{name: 'New Document'}]}).save();

    // it should save an update with an up-to-date timestamp
    const updatedDocument = new Model(document);
    updatedDocument.name = 'Updated Document';
    await expect(updatedDocument.save()).resolves.toHaveProperty('updatedAt');

    // it should fail when saving an update with an out-of-date timestamp
    const outOfDateDocument = new Model(document);
    outOfDateDocument.name = 'Stale Document';
    await expect(outOfDateDocument.save()).rejects.toThrow();
  });

  it('should be compatible with custom timestamp fields', async () => {
    const Model = getModel('CustomTimestampModel', {
      updatedAt: 'ts.updatedAt',
    });
    const document = new Model({name: 'Custom Timestamp Document'});

    // it should save an update with an up-to-date timestamp
    const updatedDocument = new Model(document);
    updatedDocument.name = 'Updated Document';
    await expect(updatedDocument.save()).resolves.toHaveProperty('ts.updatedAt');

    // it should fail when saving an update with an out-of-date timestamp
    const outOfDateDocument = new Model(document);
    outOfDateDocument.name = 'Stale Document';
    await expect(outOfDateDocument.save()).rejects.toThrow();
  });

  it('should throw an error if a schema\'s timestamps are disabled', async () => {
    expect.assertions(1);
    try {
      getModel('DisabledTimestampsModel', false);
    } catch (e) {
      expect(e).toBeInstanceOf(AssertionError);
    }
  });

  it('should throw an error if a schema\'s updatedAt timestamp is disabled', async () => {
    expect.assertions(1);
    try {
      getModel('DisabledUpdatedAtTimestampModel', {updatedAt: false});
    } catch (e) {
      expect(e).toBeInstanceOf(AssertionError);
    }
  });
});
