const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = () => {
  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "build.prod"),
      filename: "content.js",
    },
    resolve: {
      modules: [
        path.join(__dirname, "src"),
        "node_modules"
      ],
    },
    devServer: {
      static: "./",
    },
    plugins: [
      new Dotenv({ path: "./.env.production" }),
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [
          { from: "assets" }
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-transform-react-jsx"
              ]
            }
          }
        },
        {
          test: /\.scss$/i,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
            {
              loader: "sass-loader",
            },
          ],
        },
      ]
    }
  };
}