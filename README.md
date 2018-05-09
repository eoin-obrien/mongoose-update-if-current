# mongoose-update-if-current

[![Build Status](https://travis-ci.org/eoin-obrien/mongoose-update-if-current.svg?branch=master)](https://travis-ci.org/eoin-obrien/mongoose-update-if-current)
[![Version](https://img.shields.io/npm/v/mongoose-update-if-current.svg)](https://www.npmjs.com/package/mongoose-update-if-current)
[![Dependencies](https://david-dm.org/eoin-obrien/mongoose-update-if-current.svg)](https://david-dm.org/eoin-obrien/mongoose-update-if-current)
[![DevDependencies](https://david-dm.org/eoin-obrien/mongoose-update-if-current/dev-status.svg)](https://david-dm.org/eoin-obrien/mongoose-update-if-current?type=dev)
[![Maintainability](https://api.codeclimate.com/v1/badges/beece5b98159623e813a/maintainability)](https://codeclimate.com/github/eoin-obrien/mongoose-update-if-current/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/beece5b98159623e813a/test_coverage)](https://codeclimate.com/github/eoin-obrien/mongoose-update-if-current/test_coverage)

> Optimistic concurrency control plugin for [Mongoose](http://mongoosejs.com) v4.8 and higher.

This plugin brings optimistic concurrency control to Mongoose documents by incrementing document version numbers on each save, and preventing previous versions of a document from being saved over the current version.

Inspired by [issue #4004](https://github.com/Automattic/mongoose/issues/4004) in the Mongoose GitHub repository.

## Installation

```
$ npm install --save mongoose-update-if-current
```

The plugin requires Mongoose v4.8 or higher as a peer dependency.

## Getting Started

Import the plugin from the package:

```javascript
/* Using ES2015 imports */
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

/* Using require() */
var updateIfCurrentPlugin = require('mongoose-update-if-current').updateIfCurrentPlugin;
```

Add it to mongoose as a global plugin, or add it to a single schema:

```javascript
/* Global plugin */
mongoose.plugin(updateIfCurrentPlugin);

/* Single schema */
const mySchema = new mongoose.Schema({ ... });
mySchema.plugin(updateIfCurrentPlugin);
```

The plugin will hook into the `save()` function on schema documents to increment the version and check that it matches the version in the database before persisting it.

**NB:** If the schema does not have a version key, then the plugin will enable the default version key of `__v`. If the schema has a custom version key set, then the plugin will automatically regognise and use it.

## Usage

Let's save a new `Book` to MongoDB.

```javascript
    // Save a new Book document to the database
    let book = await new Book({
        title: 'The Prince',
        author: 'Niccolò Machiavelli',
    }).save();
```

Our book document should look something like this:
    
```javascript
    {
        __v: 0,
        title: 'The Prince',
        author: 'Niccolò Machiavelli',
        ...
    }
```

Now that it's in the database, a user fetches the book and updates it.

```javascript
    let book = await Book.findOne({ title: 'The Prince'});
    book.title = 'Il Principe';
    book = await book.save();
```

The book document in MongoDB now looks like this:
    
```javascript
    {
        __v: 1,  // note the incremented version
        title: 'Il Principe',
        author: 'Niccolò Machiavelli',
        ...
    }
```

Meanwhile, another user tries to update the book, fetching it before it was updated.

```javascript
    // Before the call to save() above, so book.__v is 0
    let book = await Book.findOne({ title: 'The Prince'});
    // Now the other user updates the book, so our version is out of date
    // Try to update the book based on the stale version
    book.author = 'Niccolò di Bernardo dei Machiavelli';
    book = await book.save();  // throws
```

When the other user tries to save an out-of-date version of the document to the database, the operation fails and throws an error.

See the `__tests__` directory for more usage examples.

## Caveats

- The plugin manages concurrency when a document is updated using `Document.save()`, but you can still force updates using `Model.update()`, `Model.findByIdAndUpdate()` or `Model.findOneAndUpdate()` if you so desire.
- Due to its reliance on the document version key, this plugin might not be compatible with others that affect this key.
- The plugin causes the document's version to be incremented whenever `save()` is called, contrary to Mongoose's default behaviour.

## Development

The project uses the [AirBnB JavaScript code style](https://github.com/airbnb/javascript) adapted for [TypeScript](https://github.com/progre/tslint-config-airbnb). The test suites are built on Facebook's [Jest](https://facebook.github.io/jest/). Make sure that any changes you make are fully tested and linted before submitting a pull request!

| Command | Description |
| --- | --- |
| `npm test` | Runs tests |
| `npm run build` | Builds the project |
| `npm run ci` | Builds the project, runs tests and reports coverage |
| `npm run clean` | Cleans build output directories |
| `npm run tsc` | Transpiles TypeScript to ES5 |
| `npm run tslint` | Lints TypeScript code |

## License

[MIT](http://eoin.mit-license.org)
