const { resolve } = require('path')
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        type: "asset/resource",
      },
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          context: resolve(__dirname, ''),
          from: "./src/*.html",
        },
      ],
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
          [
            "svgo",
            {
              plugins: extendDefaultPlugins([
                {
                  name: "removeViewBox",
                  active: false,
                },
                {
                  name: "addAttributesToSVGElement",
                  params: {
                    attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                  },
                },
              ]),
            }
          ]
        ]
      }
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new HtmlMinimizerPlugin(),
      new MiniCssExtractPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
  mode: "production"
};