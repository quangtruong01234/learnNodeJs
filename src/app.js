const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//init middlewares
app.use(morgan("dev")); // morgan("combined")
app.use(helmet());
app.use(compression()); //size data
//init db

//init routes
app.get("/", (req, res, next) => {
  const strCompress = "Hello FanTipjs";
  return res.status(200).json({
    message: "Welcome FanTipjs",
    metadata: strCompress.repeat(100000),
  });
});
//handling error

module.exports = app;
