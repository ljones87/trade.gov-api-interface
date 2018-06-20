const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
var server = app.listen();
server.setTimeout(50000000000);
const axios = require('axios');
if (process.env.NODE_ENV !== 'production') require('../secrets');
const apiKey = process.env.API_KEY;
const PORT = process.env.PORT || 2000;
const XLSX = require('xlsx');
const namesOnly = XLSX.readFile('namesOnly.xlsx');

//formats api call
const linkGenerator = (key, name) => {
  return `https://api.trade.gov/consolidated_screening_list/search?api_key=${key}&q=${name}`;
};

const namesWorksheet = namesOnly.Sheets[namesOnly.SheetNames[0]];
let data = XLSX.utils.sheet_to_json(namesWorksheet, { header: 1 }, {raw: false});


// Logging middleware
app.use(morgan('dev'));


// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

//for some reason lots of empty cells come in w/spreadsheet
data = data.filter(company => company.length);
data.shift();

//currently, increment 200 at a time (0, 200, 400 etc);
const i = 0;
const apiNames = data.slice(i, i+200);

const final = [];

app.get('/data', (req, res, next) => {
  console.log('===============FETCHING');

  return Promise.all(apiNames.map(query => {
    const companyName = query[0];
    return axios.get(
      linkGenerator(apiKey, query[0])
    )
      .then(result => {
        const formattedReturn = {
          company: companyName,
          data: result.data,
          api: linkGenerator(apiKey, query[0])
        };
        final.push(formattedReturn);
      })
      .catch(err => (
        console.log('===============SERVER ERROR RESPONSE', err.response || '800'),
          final.push({
          company: companyName,
          error: {
            message: err.response ?
            `${err.response.status}, ${err.response.satusText}`
            :
            `error response malformed`,
            url: linkGenerator(apiKey, query[0])
          }
        })
      ));
  }))
  .then(() => (
    res.send(final)
  ));
});

app.get('/*', function (req, res, next) {
res.sendFile(path.join(__dirname, '..', '/public/index.html'));
});

// Handle 404s
app.use(function (req, res, next) {
const err = new Error('Not Found');
err.status = 404;
next(err);
});

// Error handling endware
app.use(function (err, req, res, next) {
res.status(err.status || 500);
res.send(err.message || 'Internal server error');
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

