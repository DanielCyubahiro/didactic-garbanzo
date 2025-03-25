const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

//Create logs directory if it doesn't exit
const logsDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

//Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
    path.join(logsDirectory, 'access.log'), {flags: 'a'});

// Configure morgan to log in 'combined' format (Apache-style)
const logger = morgan('combined', {stream: accessLogStream});

module.exports = logger;