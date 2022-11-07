const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
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
    new Dotenv(),
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
        use: [
          {
            loader: "file-loader",
            options: { name: "[name].css" }
          },
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          "sass-loader",         
        ],
      },
    ],
  }  
};