const router = require('express').Router();
const axios = require('axios');
const XLSX = require('xlsx');
const rimraf = require('rimraf');
const multer = require('multer');
const {
  apiLinkGenerator,
  queryResult,
  errorWithResponse,
  errorWithoutResponse
} = require('../utils');
module.exports = router;

const storage = multer.diskStorage({
  destination: "./uploads",
  filename(req, file, cb) {
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  }
});

const upload = multer({ storage }).single("file");

let spreadsheetForAnalysis, data, worksheet;
let apiInput = [];
let finalAddressResults = [];

router.post("/spreadsheet", upload, (req, res, next) => {
  const file = req.file; // file passed from client

  if (file.mimetype.includes('sheet') || file.mimetype.includes('excel')) {
    spreadsheetForAnalysis = XLSX.readFile(file.path);
    worksheet = spreadsheetForAnalysis.Sheets[spreadsheetForAnalysis.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }, { raw: false });
    data = data.filter(cellContent => cellContent[0] && cellContent[0].length > 1);
    //this removes the column label row
    data.shift();
    res.send({ listlength: data.length })
  } else {
    res.send('Only excel file inputs allowed'),
    rimraf('uploads', () => console.log(' uploads removed'))
  }
  next()
});

router.delete("/spreadsheet/reset", (req, res, next) => {
  finalAddressResults = [];
  res.send({ listlength: 0 });
  rimraf('uploads', (err) => console.log('ready for new list'));
  next()
});

router.post("/", (req, res, next) => {
  let i = Number(req.body.count);
  let j = i + 100;
  apiInput = data.slice(i, j);
  //remove temp upload directory since file is now processed under 'data'
  if (i < 100) rimraf('uploads', () => console.log(' uploads removed'))

  while (i < data.length) {
    return Promise.all(
      apiInput.map(query => {
        const address = query[0];
        return axios
          .get(apiLinkGenerator(`address`, address))
          .then(result => {
            finalAddressResults.push(queryResult(`address`, address, result));
          })
          .catch(err =>
            err.response ?
              finalAddressResults.push(errorWithResponse(address, err))
              :
              finalAddressResults.push(errorWithoutResponse(`address`, address))
          );
      })
    )
    .then(() => (
      (j = i + 100),
      res.send(finalAddressResults)
    ))
    .catch(err => {
      res.status(500).send(err);
      console.log("=============== fetch data error", err);
    });
  }
});
