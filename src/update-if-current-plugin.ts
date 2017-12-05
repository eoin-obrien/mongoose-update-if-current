import * as mongoose from 'mongoose';

export function updateIfCurrentPlugin(schema: mongoose.Schema) {
  // Throw an error if the save fails
  schema.set('saveErrorIfNotFound', true);

  // Enable the version key if necessary
  if (!schema.get('versionKey')) {
    schema.set('versionKey', '__v');
  }
  const versionKey = schema.get('versionKey');

  // Add version condition and increment version
  schema.pre('save', function (next) {
    this.$where = {};
    this.$where[versionKey] = this[versionKey];
    this.increment();
    next();
  });
}
