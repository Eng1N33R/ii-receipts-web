const express = require('express'),
  path = require('path'),
  proxy = require('express-http-proxy'),
  bodyParser = require('body-parser'),
  winston = require('winston'),
  expressWinston = require('express-winston');

require('dotenv').config();

const app = express();

app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ name: 'FILE_COMBINED', filename: 'log/receipts.log' }),
    new winston.transports.File({ name: 'FILE_ERRORS', filename: 'log/receipts-error.log', level: 'error' }),
    new winston.transports.Console({ name: 'CONSOLE_OUTPUT', level: process.env.NODE_ENV === 'production' ? 'error' : 'info' })
  ],
  expressFormat: true,
  colorize: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', proxy(`${process.env.API_HOST}:${process.env.API_PORT}`, {
  proxyReqPathResolver: function(req) {
    const url = '/api' + require('url').parse(req.url).path;
    //console.log(`${req.method} ${url}`);
    return url;
  },
  proxyReqOptDecorator: function(reqOpts) {
    const authString = Buffer.from(process.env.API_USER + ':' + process.env.API_PASSWORD).toString('base64');
    //console.log(`Authorization: Basic ${authString}`);
    reqOpts.headers['Authorization'] = `Basic ${authString}`;
    return reqOpts;
  },
  timeout: 3000
}));

app.use(express.static(path.join(__dirname, '/dist/')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Server listening on http://localhost:${port} in ${process.env.NODE_ENV} mode`);
});
