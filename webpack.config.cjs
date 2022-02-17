const path = require('path');

module.exports = {
  entry: './src/for-webpack.cjs',
  output: {
    filename: 'dom-master.bundle.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: "$$",
  }
};