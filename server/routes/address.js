const router = require("express").Router();
module.exports = router;
const axios = require("axios");
if (process.env.NODE_ENV !== "production") require("../../secrets");
const apiKey = process.env.API_KEY;
const XLSX = require("xlsx");
const multer = require("multer");
const rimraf = require("rimraf");

//saves file locally for processing
const storage = multer.diskStorage({
  destination: "./uploads",
  filename(req, file, cb) {
    cb(null, `${new Date()}-${file.originalname}`);
  }
});

const upload = multer({ storage }).single("file");

//formats api call
const addresslinkGenerator = (key, address) => {
  return `https://api.trade.gov/consolidated_screening_list/search?api_key=${key}&address=${address}`;
};

let spreadsheetForAnalysis, data, worksheet;
let apiInput = [];
let finalAddressResults = [];

router.post("/spreadsheet", upload, (req, res, next) => {
  const file = req.file; // file passed from client

  if (file.mimetype.includes('sheet') || file.mimetype.includes('excel')) {
    spreadsheetForAnalysis = XLSX.readFile(file.path);
    worksheet = spreadsheetForAnalysis.Sheets[spreadsheetForAnalysis.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }, { raw: false });
    data = data.filter(
      cellContent => cellContent[0] && cellContent[0].length > 1);
    data.shift();
    res.send({ listlength: data.length })
  } else {
      res.send('Only excel file inputs allowed'),
      rimraf('uploads', () => console.log(' uploads removed'))
  }
    next()
  });

router.delete("/spreadsheet/reset", (req, res, next) => {
  rimraf('uploads', () => console.log(' uploads removed'))  
  finalAddressResults = [];
  res.send({ listlength: 0 });
});

router.post("/", (req, res, next) => {
  let i = Number(req.body.count);
  let j = i + 100;
  apiInput = data.slice(i, j);
  while (i < data.length) {
    return Promise.all(
      apiInput.map(query => {
        const address = query[0];
        return axios
          .get(addresslinkGenerator(apiKey, query[0]))
          .then(result => {
            const formattedReturn = {
              addressSearched: address,
              data: result.data,
              api: addresslinkGenerator(apiKey, query[0])
            };
            finalAddressResults.push(formattedReturn);
          })
          .catch(err =>
            finalAddressResults.push({
              addressSearched: address,
              error: {
                message: err.response
                  ? `${err.response.status}, ${err.response.satusText}`
                  : `error response malformed`,
                url: addresslinkGenerator(apiKey, query[0])
              }
            })
          );
      })
    )
      .then(() => (
        (j = i + 100), 
        res.send(finalAddressResults),
        rimraf('uploads', () => console.log(' uploads removed'))  
        ))
      .catch(err => {
        res.status(500).send(err);
        console.log("=============== fetch data error", err);
      });
  }
});
