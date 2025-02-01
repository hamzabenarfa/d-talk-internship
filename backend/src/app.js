const express = require("express");
const cors = require("cors");
const morgan = require('morgan');   

const api = require('./routes');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());
//app.use(morgan('dev'));


app.use('/', api);
app.use('/uploads', express.static('./public/images'));


module.exports = app;
