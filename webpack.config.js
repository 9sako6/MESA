
const path = require('path');

module.exports = {
  entry: './src/app.ts',
  output: {
    filename: 'mesa.min.js',
    path: path.join(__dirname, './dest')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ]
  }
};