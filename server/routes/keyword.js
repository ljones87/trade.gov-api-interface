const router = require('express').Router();
const axios = require('axios');
const XLSX = require('xlsx');
const rimraf = require('rimraf');
const multer = require('multer');
const fs = require('fs');
const {
  apiLinkGenerator,
  queryResult,
  errorWithResponse,
  errorWithoutResponse,
} = require('../utils');
module.exports = router;

const storage = multer.diskStorage({
  destination: "./temp",
  filename(req, file, cb) {
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  }
});

const upload = multer({ storage }).single("file");

let spreadsheetForAnalysis,
  data,
  worksheet;
let apiInput = [];
let finalKeywordResults = [];

router.post("/spreadsheet", upload, (req, res, next) => {
  const file = req.file; // file passed from client

  if (file.mimetype.includes('sheet') || file.mimetype.includes('excel')) {
    spreadsheetForAnalysis = XLSX.readFile(file.path);
    worksheet =
      spreadsheetForAnalysis.Sheets[spreadsheetForAnalysis.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }, { raw: false });
    data = data.filter(cellContent => cellContent[0].length);
    //this removes the column label row
    data.shift();
    res.send({ listlength: data.length });
    next()
  } else {
    res.send('Only Excel file inputs allowed'),
    rimraf('temp/*', (err) => console.log('temp upload removed'));
  }
  next();
});

router.post("/", (req, res, next) => {
  let i = Number(req.body.count);
  let j = i + 100;
  apiInput = data.slice(i, j);
  //remove temp upload directory since file is now processed under 'data'
  if (i < 100) rimraf('temp/*', (err) => console.log('temp upload removed'));

  while (i < data.length) {
    return Promise.all(
      apiInput.map(query => {
        const keyword = query[0];
        return axios.get(apiLinkGenerator(`q`, keyword))
          .then(result => {
            finalKeywordResults.push(queryResult(`q`, keyword, result));
          })
          .catch(err => (
            err.response ?
              finalKeywordResults.push(errorWithResponse(keyword, err))
              :
              finalKeywordResults.push(errorWithoutResponse(`q`, keyword))
          ));
      })
    )
    .then(() => (
      (j = i + 100),
      res.send(finalKeywordResults)
    ))
    .catch(err => {
      res.status(500).send(err);
      console.log("=============== fetch data error", err);
    });
  }
});

router.delete("/spreadsheet/reset", (req, res, next) => {
  finalKeywordResults = [];
  res.send({ listlength: 0 });
  rimraf('temp/*', (err) => console.log('ready for new list'));
  next()
});
