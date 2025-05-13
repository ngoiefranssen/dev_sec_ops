const express = require('express');
const app = express();
const cors = require("cors");

const dotenv = require('dotenv');
const fileUpload = require("express-fileupload");

const routesProvider = require('./routes/routesProvider');

dotenv.config()

app.use(cors({
  origin: "*"
}));

app.use(express.static(__dirname + "/../public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/secops/api/v1/', routesProvider);

app.all('*', async (_, res) => res.status(404).json({ message: 'Not Found', httpStatus: 404, data: null }))

module.exports = app;