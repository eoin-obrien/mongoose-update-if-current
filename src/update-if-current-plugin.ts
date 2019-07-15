import * as mongoose from 'mongoose';

export function updateIfCurrentPlugin(schema: mongoose.Schema) {
  // Enable document version key if necessary
  if (!schema.get('versionKey')) {
    schema.set('versionKey', '__v');
  }

  // Get version key name
  const versionKey = schema.get('versionKey');

  // Add pre-save hook to check version
  schema.pre('save', function (next) {
    // Condition the save on the versions matching
    this['$where'] = {
      [versionKey]: this[versionKey],
    };
    // Increment the version once saved
    this.increment();
    next();
  });
}
