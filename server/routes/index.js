'use strict';
const router = require('express').Router();
module.exports = router;

router.use('/keyword', require('./keyword'));
router.use('/address', require('./address'));

router.use((req, res) => {
  res.status(404).end();
});
