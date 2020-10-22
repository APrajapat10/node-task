const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json()); // Basically tells the system that we want JSON to be used.

const morgan = require('morgan');

app.use(morgan('dev'));

require('./routes')(app);

// eslint-disable-next-line no-console
app.listen(5000, () => console.log('Server started on port 5000'));

module.exports = app;
