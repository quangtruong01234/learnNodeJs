
require('dotenv').config()
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//init middlewares
app.use(morgan("dev")); // morgan("combined")
app.use(helmet());
app.use(compression()); //size data
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
//init db
require('./dbs/init.mongodb')
// const {checkOverload} = require('./helpers/check.connect')
// checkOverload()
//init routes
app.use('/',require('./routes'))
//handling error

module.exports = app;
