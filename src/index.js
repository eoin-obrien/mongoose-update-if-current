import 'core-js/stable';
import 'regenerator-runtime/runtime';

import assert from 'assert';
import {versionOCCPlugin} from './version-occ-plugin';
import {timestampOCCPlugin} from './timestamp-occ-plugin';

/**
 * Implement optimistic concurrency control on a Mongoose schema.
 *
 * @param {mongoose.Schema} schema - A Mongoose schema to be plugged into.
 * @param {object} options - A Mongoose schema to be plugged into.
 */
export function updateIfCurrentPlugin(schema, options) {
  // Default to using the version field for concurrency control
  const strategy = (options && options.strategy) || 'version';

  // Apply plugin based on strategy
  if (strategy === 'version') {
    schema.plugin(versionOCCPlugin);
  } else if (strategy === 'timestamp') {
    schema.plugin(timestampOCCPlugin);
  } else {
    assert(
        false,
        'concurrency control strategy must be one of "version" or "timestamp"'
    );
  }
}
