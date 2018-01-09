module.exports = {
  entry: "src/index.js",
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr",
        "transform-runtime",
        ["import", { libraryName: "antd", style: "css" }],
        ["transform-decorators-legacy"]
      ]
    },
    production: {
      extraBabelPlugins: [
        "transform-runtime",
        ["import", { libraryName: "antd", style: "css" }],
        ["transform-decorators-legacy"]
      ]
    }
  }
};
