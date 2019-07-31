// const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DIRs = require('./dirs');

const config = {
  mode: 'production',
  entry: {
    index: `${DIRs.src}/index.js`,
  },
  output: {
    // [name].js
    filename: '[name].js',
    path: DIRs.dist,
    // https://github.com/webpack/webpack/tree/master/examples/multi-part-library
    // <script>方式引入，非amd,commonjs,es6，使用：window.PhonevalidateModal
    library: ['PhonevalidateModal'],
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
        from: `${DIRs.src}/index.js`,
        to: `${DIRs.home}/es6/index.js`,
        force: true,
    }]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
            DIRs.src,
        ],
        options: {
            babelrc: true, // 使用babel默认配置
        },
      },
    ]
  },
  devtool: false,
  // externals: /^(axios|vue)$/i,
};

module.exports = (env = {}) => {
  if(env.type === 'analyzer') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8890,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info'
      })
    );
  }
  return config;
};