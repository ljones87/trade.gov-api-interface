const multer = require("multer");
if (process.env.NODE_ENV !== 'production') require('../secrets')
const apiKey = process.env.API_KEY;

const apiLinkGenerator = (queryType, query) => {
  return `https://api.trade.gov/consolidated_screening_list/search?api_key=${apiKey}&${queryType}=${query}`;
};

const queryResult = (queryType, queryTerm, result) => ({
  searchedFor: queryTerm,
  data: result.data,
  api: apiLinkGenerator(queryType, queryTerm)
});

const errorWithResponse = (queryTerm, err) => ({
  searchedFor: queryTerm,
   error: {
    message: `${err.response.status}, ${err.response.satusText}`,
    url: err.response.request.res.responseUrl
  }
});

const errorWithoutResponse = (queryType, queryTerm) => ({
  searchedFor: queryTerm,
   error: {
    message: `error response malformed`,
    url: apiLinkGenerator(queryType, queryTerm)
  }
});

module.exports = {
  apiLinkGenerator,
  errorWithResponse,
  errorWithoutResponse,
  queryResult
}
