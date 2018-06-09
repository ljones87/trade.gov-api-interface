const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
if (process.env.NODE_ENV !== 'production') require('../secrets');
const apiKey = process.env.API_KEY;
const PORT = process.env.PORT || 2000;
const XLSX = require('xlsx');
const namesOnly = require('../namesOnly');

//formats api call
const linkGenerator = (api, altName) => {
  return `https://api.trade.gov/consolidated_screening_list/search?api_key=${apiKey}&q=${altName}
  `;
};

const namesWorksheet = namesOnly.Sheets[namesOnly.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(namesWorksheet, {header: 1 });

console.log('===============', data)
//returns data by year specified by index
// years start at 1980 (index 34) up to 2014 (index 0)

const type = (company) => ({
  'Company Name': company.name,
  Addresses: company.addresses,
  Type: company.type,
});

const numResults = (response) => ({
  numMatch: response.results.length
})

// Logging middleware
app.use(morgan('dev'));


// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static middleware
app.use(express.static(path.join(__dirname, '..', 'public')));



//fill in values for API call
const apiNames = /* EXCEL SPREADSHEET SOURCE HERE*/



app.get('/data', (req, res, next) => {
  axios.all(apiNames.map(altName => axios.get(linkGenerator(apiKey, altName))) )
    .then(res => console.log('===============',res))

      // axios.spread((CO, CA, NY, MT, OR, WY, TX) => {
      // const states = [CO, CA, NY, MT, OR, WY, TX];
      // return states.map(state => info(state));
    //}))
    //.then(formattedStates => res.json(formattedStates))
    .catch(err => console.log(err));
});


// For all GET requests that aren't to an API route,
// we will send the index.html!
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

