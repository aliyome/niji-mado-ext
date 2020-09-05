import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

module.exports = {
  entry: {
    content_scripts: path.join(__dirname, 'src', 'content_scripts.ts'),
    background: path.join(__dirname, 'src', 'background.ts'),
    popup: path.join(__dirname, 'src', 'popup.ts'),
  },
  output: {
    // distディレクトリにcontent_scripts.jsを吐く
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              importLoaders: 2,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    // publicディレクトリにあるファイルをdistディレクトリにコピーする
    new CopyWebpackPlugin({ patterns: [{ from: 'public', to: '.' }] }),
  ],
};
