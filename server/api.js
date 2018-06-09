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
const namesOnly = XLSX.readFile('namesOnly.xlsx')

//formats api call
const linkGenerator = (api, altName) => {
  return `https://api.trade.gov/consolidated_screening_list/search?api_key=${apiKey}&q=${altName}
  `;
};

 const namesWorksheet = namesOnly.Sheets[namesOnly.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(namesWorksheet,  {header: 1 });

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
data.shift();
const apiNames = data;
 console.log('===============API )', apiNames)

 const final = [];
 app.get('/data', (req, res, next) => {
  console.log('===============FETCHING')

  apiNames.forEach(altName => axios.get(linkGenerator(apiKey, altName[0]))
    .then(result => {
      const companyName = altName[0]
      final.push({company: companyName, data: result.data });
      return res.json({company: companyName, data: result.data  })
    })
    .catch(err => final.push({companyName: err}))
  )
  console.log('===============',final)
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

