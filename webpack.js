const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = ({ production }, { mode }) => {
  const isDevMode = node = "development";

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, isDevMode ? "dist" : "build"),
      filename: "content.js",
    },
    resolve: {
      modules: [
        path.join(__dirname, "src"),
        "node_modules"
      ],
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      historyApiFallback: true,
      port: 3000,
    },
    plugins: [
      new Dotenv(),
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [
          { from: "assets" }
        ],
      }),
    ].filter(Boolean),
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