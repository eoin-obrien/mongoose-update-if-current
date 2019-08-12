import mongoose from 'mongoose';
import {AssertionError} from 'assert';
import {updateIfCurrentPlugin} from '../src';
import {versionOCCPlugin} from '../src/version-occ-plugin';
import {timestampOCCPlugin} from '../src/timestamp-occ-plugin';

jest.mock('../src/version-occ-plugin');
jest.mock('../src/timestamp-occ-plugin');

const getSchema = () =>
  new mongoose.Schema(
      {
        name: String,
      },
      {
        timestamps: true,
      }
  );

describe('mongoose-update-if-current', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should use the version key as the OCC field by default', () => {
    const schema = getSchema();
    schema.plugin(updateIfCurrentPlugin);
    expect(versionOCCPlugin).toHaveBeenCalledWith(schema, undefined);
    expect(timestampOCCPlugin).not.toHaveBeenCalled();
  });

  it('should allow the version key to be selected as the OCC field', () => {
    const schema = getSchema();
    schema.plugin(updateIfCurrentPlugin, {strategy: 'version'});
    expect(versionOCCPlugin).toHaveBeenCalledWith(schema, undefined);
    expect(timestampOCCPlugin).not.toHaveBeenCalled();
  });

  it('should allow the updatedAt timestamp to be selected as the OCC field', () => {
    const schema = getSchema();
    schema.plugin(updateIfCurrentPlugin, {strategy: 'timestamp'});
    expect(versionOCCPlugin).not.toHaveBeenCalled();
    expect(timestampOCCPlugin).toHaveBeenCalledWith(schema, undefined);
  });

  it('should throw an error if an unknown strategy is specified', () => {
    const schema = getSchema();
    expect.assertions(1);
    try {
      schema.plugin(updateIfCurrentPlugin, {strategy: 'other'});
    } catch (e) {
      expect(e).toBeInstanceOf(AssertionError);
    }
  });
});
