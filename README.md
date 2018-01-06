# mongoose-update-if-current

[![Build Status](https://travis-ci.org/eoin-obrien/mongoose-update-if-current.svg?branch=master)](https://travis-ci.org/eoin-obrien/mongoose-update-if-current)
[![NPM version](https://img.shields.io/npm/v/mongoose-update-if-current.svg)](https://www.npmjs.com/package/mongoose-update-if-current)
[![Node version](https://img.shields.io/node/v/mongoose-update-if-current.svg?style=flat)](https://www.npmjs.com/package/mongoose-update-if-current)
[![Dependencies](https://david-dm.org/eoin-obrien/mongoose-update-if-current.svg)](https://david-dm.org/eoin-obrien/mongoose-update-if-current)
[![DevDependencies](https://david-dm.org/eoin-obrien/mongoose-update-if-current/dev-status.svg)](https://david-dm.org/eoin-obrien/mongoose-update-if-current?type=dev)
[![Maintainability](https://api.codeclimate.com/v1/badges/beece5b98159623e813a/maintainability)](https://codeclimate.com/github/eoin-obrien/mongoose-update-if-current/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/beece5b98159623e813a/test_coverage)](https://codeclimate.com/github/eoin-obrien/mongoose-update-if-current/test_coverage)

Optimistic concurrency (OCC) plugin for [mongoose](http://mongoosejs.com) v4.8 and higher.

Increments document version numbers on each save, and prevents previous versions of a document
from being saved over a newer version.

Inspired by [this issue](https://github.com/Automattic/mongoose/issues/4004) in the mongoose repo.

See the `__tests__` directory for examples.

## Install

```
$ npm install --save mongoose-update-if-current
```

## Usage

On a single schema:

```javascript
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
const mongoose = require('mongoose');

const mySchema = new mongoose.Schema({ ... });
mySchema.plugin(updateIfCurrentPlugin);
```

Globally:

```javascript
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
const mongoose = require('mongoose');

mongoose.plugin(updateIfCurrentPlugin);
```


## Commands

```
npm run build             # build the library files
npm run test              # run the tests
npm run coverage          # run the tests with coverage
npm run prepare           # build the library, make sure the tests passes, and then pack the library (creates .tgz)
npm run release           # prepare package for next release
```

## License

[MIT](http://vjpr.mit-license.org)
