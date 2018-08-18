const router = require('express').Router();
module.exports = router;
const axios = require('axios');
if (process.env.NODE_ENV !== 'production') require('../../secrets');
const apiKey = process.env.API_KEY;

const XLSX = require('xlsx');
let spreadsheet, spreadsheetForAnalysis, data, worksheet;
let apiInput = [];

//formats api call
const addresslinkGenerator = (key, address) => {
  return `https://api.trade.gov/consolidated_screening_list/search?api_key=${key}&address=${address}`;
}

let finalAddressResults = [];

router.post('/spreadsheet', (req, res, next) => {
  spreadsheet = req.body.spreadsheet;
  spreadsheetForAnalysis = XLSX.readFile(spreadsheet);
  worksheet = spreadsheetForAnalysis.Sheets[spreadsheetForAnalysis.SheetNames[0]];
  data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }, { raw: false });
  data = data.filter(cellContent => cellContent[0].length > 1);
  data.shift();
  console.log('===============', data.length);
  res.send({ listlength: data.length });
});

router.delete('/spreadsheet/reset', (req, res, next) => {
  spreadsheet = null;
  finalAddressResults = [];
  res.send({ listlength: 0 });
})

router.post('/', (req, res, next) => {
  let i = Number(req.body.count);
  let j = i + 100;
  apiInput = data.slice(i, j);
  while (i < data.length) {
    return Promise.all(apiInput.map(query => {
      const address = query[0];
      return axios.get(
        addresslinkGenerator(apiKey, query[0])
      )
        .then(result => {
          const formattedReturn = {
            addressSearched: address,
            data: result.data,
            api: addresslinkGenerator(apiKey, query[0])
          };
          finalAddressResults.push(formattedReturn);
        })
        .catch(err => (
          //  console.log('===============SERVER ERROR RESPONSE', err.response || '800'),
          finalAddressResults.push({
            addressSearched: address,
            error: {
              message: err.response ?
                `${err.response.status}, ${err.response.satusText}`
                :
                `error response malformed`,
              url: err.response.request.res.responseUrl || addresslinkGenerator(apiKey, query[0])
            }
          })
        ));
    }))
      .then(() => (
        j = i + 100,
        res.send(finalAddressResults)
      ))
      .catch(err => {
        res.sendStatus(500);
        console.log('=============== fetch data error', err);
      });
  }
});




