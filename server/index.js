'use strict';
const express = require('express')
const path = require('path');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const server = app.listen();
server.setTimeout(5000000);
const PORT = process.env.PORT || 2000;
module.exports = app

// Logging middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', require('./routes'));

app.get('/*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '..', '/public/index.html'));
});

// Error catching endware.
app.use(function (err, req, res, next) {
  console.error(err, typeof next);
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.listen(PORT, () => console.log(`App running on port ${PORT}: http://localhost:2000/`));
