/* eslint-disable no-invalid-this */
import assert from 'assert';
import Kareem from 'kareem';

/**
 * Implement optimistic concurrency control using a schema's timestamps.
 *
 * @param {mongoose.Schema} schema - A Mongoose schema to be plugged into.
 */
export function timestampOCCPlugin(schema) {
  assert(schema.$timestamps, 'schema must have timestamps enabled');

  const updatedAt = schema.$timestamps.updatedAt;
  assert(updatedAt, 'schema must have the updatedAt timestamp enabled');

  // Add pre-save hook to check timestamp for concurrency control
  const hooks = new Kareem();
  hooks.pre('save', function(next) {
    // Condition the save on the updatedAt timestamps matching
    this.$where = {
      ...this.$where,
      [updatedAt]: this[updatedAt],
    };

    // Invoke next hook
    next();
  });

  // Merge plugin hooks with schema hooks to ensure that the OCC hook
  // is invoked before mongoose's built-in timestamp update hook
  schema.s.hooks = hooks.merge(schema.s.hooks);
}
