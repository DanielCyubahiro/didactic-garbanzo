const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();


const routes = require('./routes/index');
const requestLogger = require('./config/logger');
const verifyJWT = require('./middlewares/auth.middleware');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middleware
app.use(requestLogger);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', routes.authRoutes);

//Authenticated routes
app.use(verifyJWT)
app.use('/employees', routes.employeeRoutes);

module.exports = app;
