const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
var server = app.listen();
server.setTimeout(5000000);
const axios = require('axios');
if (process.env.NODE_ENV !== 'production') require('../secrets');
const apiKey = process.env.API_KEY;
const PORT = process.env.PORT || 2000;
const XLSX = require('xlsx');
let spreadsheet, spreadsheetForAnalysis, data, worksheet;
let apiInput = [];

//formats api call
const linkGenerator = (key, name) => {
  return `https://api.trade.gov/consolidated_screening_list/search?api_key=${key}&q=${name}`;
};

// Logging middleware
app.use(morgan('dev'));


// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

//for some reason lots of empty cells come in w/spreadsheet

const final = [];

app.post('/spreadsheet', (req, res, next) => {
  spreadsheet = req.body.spreadsheet;
  spreadsheetForAnalysis = XLSX.readFile(spreadsheet);
  worksheet = spreadsheetForAnalysis.Sheets[spreadsheetForAnalysis.SheetNames[0]];
  data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }, {raw: false});
  data = data.filter(cellContent => cellContent.length);
  data.shift();
  console.log('===============', data.length)
  res.sendStatus(200);
});

app.post('/data', (req, res, next) => {
  let i = Number(req.body.count);
  console.log('===============i', req.body.count);
  apiInput = data.slice(i, i + 100);
  console.log('===============api input', apiInput)
  return Promise.all(apiInput.map(query => {
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
       //console.log('===============SERVER ERROR RESPONSE', err.response || '800'),
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
  ))
  .catch(err => {
    console.log('=============== fetch data error', err)
  })
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

