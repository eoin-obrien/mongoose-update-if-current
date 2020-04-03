import mongoose from 'mongoose';
import {versionOCCPlugin} from '../src/version-occ-plugin';
import {AssertionError} from 'assert';

// Install plugin
mongoose.plugin(versionOCCPlugin);

/**
 * Generate a model with an optional version key.
 *
 * @param {string} name
 * @param {string|boolean|undefined} versionKey
 *
 * @return {mongoose.Model}
 */
function getModel(name, versionKey) {
  const schema = new mongoose.Schema({
    name: String,
    nested: [{
        _id: false,
        name: String,
    }],
  });
  if (versionKey !== undefined) {
    schema.set('versionKey', versionKey);
  }
  return mongoose.model(name, schema);
}

describe('versionOCCPlugin', () => {
  it('should implement OCC using the schema\'s version key', async () => {
    const Model = getModel('DefaultVersionModel');

    // it should save a new document
    const document = await new Model({name: 'New Document', nested: [{name: 'New Document'}]}).save();
    expect(document.__v).toBe(0);

    // it should increment the version number when saving an update
    let updatedDocument = new Model(document);
    updatedDocument.name = 'Updated Document';
    updatedDocument = await updatedDocument.save();
    expect(updatedDocument.__v).toBe(1);

    // it should fail when saving an earlier version over a later version
    const staleDocument = new Model(document);
    staleDocument.__v = 0;
    staleDocument.name = 'Stale Document';
    await expect(staleDocument.save()).rejects.toBeInstanceOf(Error);
  });

  it('should be compatible with custom version keys', async () => {
    const Model = getModel('CustomVersionModel', 'version');
    const document = await new Model({
      name: 'Custom Version Document',
    }).save();
    expect(document.version).toBe(0);
  });

  it('should throw an error if a schema\'s version key is disabled', async () => {
    expect.assertions(1);
    try {
      getModel('DisabledVersionModel', false);
    } catch (e) {
      expect(e).toBeInstanceOf(AssertionError);
    }
  });
});
