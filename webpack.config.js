const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const browserify = require('browserify');
const path = require('path');
const fs = require('fs');


const PACKAGE_FILE = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8').toString());
const LIB_NAME = PACKAGE_FILE.name;

/* helper function to get into build directory */
const libPath = function (name) {
  if (undefined === name) {
    return 'dist';
  }

  return path.join('dist', name);
};

/* helper to clean leftovers */
const outputCleanup = function (dir) {
  const path = libPath();
  if (!fs.existsSync(path)) {
    return;
  }

  const list = fs.readdirSync(dir);
  for (let i = 0; i < list.length; i++) {
    const filename = path.join(dir, list[i]);
    const stat = fs.statSync(filename);

    if (filename === '.' || filename === '..') {
      // pass these files
    } else if (stat.isDirectory()) {
      // outputCleanup recursively
      outputCleanup(filename, false);
    } else {
      // rm fiilename
      fs.unlinkSync(filename);
    }
  }
  fs.rmdirSync(dir);
};

/* percentage handler is used to hook build start and ending */
const percentage_handler = function handler(percentage) {
  if (0 === percentage) {
    /* Build Started */
    outputCleanup(libPath());
    console.log('Build started... Good luck!');
  } else if (1.0 === percentage) {
    create_browser_version(webpack_opts.output.filename);
  }
};

// noinspection JSUnresolvedFunction
const webpack_opts = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: libPath('index.js'),
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      'src',
    ],
  },
  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: /node_modules/,
      }, {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: [
          /node_modules/,
        ],
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        tslint: {
          emitErrors: true,
          failOnHint: true,
        },
      },
    }),
    new webpack.ProgressPlugin(percentage_handler),
  ],
};

const create_browser_version = function (inputJs) {
  let outputName = inputJs.replace(/\.[^/.]+$/, '');
  outputName = `${outputName}.browser.js`;
  console.log('Creating browser version ...');

  let b = browserify(inputJs, {
    standalone: LIB_NAME,
  });

  // noinspection JSUnresolvedFunction
  b.bundle(function (err) {
    if (err != null) {
      console.error('Browserify error:');
      console.error(err);
    }
  }).pipe(fs.createWriteStream(outputName));
};

module.exports = webpack_opts;
