/** @format */
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"), //依赖图的开始点
  output: {
    path: path.resolve(__dirname, "dist"), //输出文件的路径
    filename: "index.bundle.js", //输出文件的名字
  },
  mode: "development",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts|tsx|js|jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [require.resolve("react-refresh/babel")],
          },
        },
      },
      {
        test: /\.css|less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        //其它文件格式，如图片，字体
        test: /\.(eot|woff|woff2|svg|jpe?g|png|ttf)([\?]?.*)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({
      //根据模板插入css/js等生成最终HTML，主要贡献为混淆
      template: path.resolve(__dirname, "./public/index.html"), //html模板路径
      inject: "body", //是否以及何处注入静态资源
      hash: true, //是否为所有注入的静态资源添加webpack每次编译产生的唯一hash值，是则很方便清除cache
    }),
  ],
  devServer: {
    //配置本地服务器
    static: "./dist",
    historyApiFallback: true,
    port: 3000, //运行的端口
    hot: true, //热更新
  },
};
