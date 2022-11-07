const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = (env) => {  
  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, env.WEBPACK_BUILD ? "build" : "dist"),
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
          exclude: /node_modules/,
          generator: {
            filename: "style.css",
          },
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
            "sass-loader",         
          ],
        },
      ],
    }  
  };
}