const path = require("path");
const Dotenv = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = () => {  
  return {
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
    plugins: [
      new Dotenv(),
      new CopyPlugin({
        patterns: [
          { from: "public" }
        ],
      }),
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      historyApiFallback: true,
      port: 3000,
    },
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
            {
              loader: "style-loader",
            },
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
      ],
    }  
  };
}