const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  target: "web",
  performance: {
    hints: false,
  },
  node: {
    fs: "empty"
  },
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/build"),
    chunkFilename: "[name].[contenthash].js",
    filename: "[name].[contenthash].js"
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
      {
        test: /\.css$/,
        use: [
          ExtractCssChunks.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[local]"
            }
          }
        ]
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff&name=[name].[contenthash].[ext]"
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff&name=[name].[contenthash].[ext]"
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/octet-stream&name=[name].[contenthash].[ext]"
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: "file-loader?name=[name].[contenthash].[ext]"
      }, {
        test: /\.(svg|gif|jpg|png|ico)(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=1000&mimetype=image/svg+xml&name=images/[name].[contenthash].[ext]"
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),

    new webpack.DefinePlugin({
      "catalogHost": JSON.stringify(process.env.CATALOG_HOST),
      "grootHost": JSON.stringify(process.env.GROOT_HOST),
      "partnerLogoutUrl": JSON.stringify(process.env.PARTNER_LOGOUT_URL),
      "AuthKey": JSON.stringify(process.env.AUTH_KEY),
      "ttl": JSON.stringify(process.env.TTL),
      "debug": JSON.stringify(process.env.DEBUG),
      "statusDraft": JSON.stringify(process.env.STATUS_DRAFT),
      "statusRevision": JSON.stringify(process.env.STATUS_REVISION),
      "statusReview": JSON.stringify(process.env.STATUS_REVIEW),
      "statusActive": JSON.stringify(process.env.STATUS_ACTIVE),
      "statusInactive": JSON.stringify(process.env.STATUS_INACTIVE),
      "statusSentForPublish": JSON.stringify(process.env.STATUS_SENT_FOR_PUBLISH),
      "statusPending": JSON.stringify(process.env.STATUS_PENDING),
      "creatorPermission": JSON.stringify(process.env.CREATOR_PERMISSION),
      "reviewerPermission": JSON.stringify(process.env.REVIEWER_PERMISSION),
      "publisherPermission": JSON.stringify(process.env.PUBLISHER_PERMISSION),
      "unpublisherPermission": JSON.stringify(process.env.UNPUBLISHER_PERMISSION),
      "imageSize": JSON.stringify(process.env.IMAGE_SIZE),   //1024*1024 = 1MB
      "FroalaKey": JSON.stringify(process.env.FROALA_KEY),
      "timeout": JSON.stringify(process.env.TIMEOUT),
      "pendingTimeout": JSON.stringify(process.env.PENDING_TIMEOUT),
      "pageListSize": JSON.stringify(process.env.PAGE_LIST_SIZE),
      "templateAPI": JSON.stringify(process.env.TEMPLATE_API),
      "getGroupUserUrl": JSON.stringify(process.env.GET_GROUP_USER_URL)
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html'
    }),

    new ExtractCssChunks({
      filename: "[name].[contenthash].css",
      chunkFilename: "[name].[contenthash].css",
    }),

    new OptimizeCssAssetsPlugin(),

    new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.optimize.OccurrenceOrderPlugin(),

    new webpack.HashedModuleIdsPlugin(),

    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: false
    }),

    //new BundleAnalyzerPlugin()
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    },
    runtimeChunk: 'single',
  }

};