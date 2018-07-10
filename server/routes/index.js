'use strict';
const router = require('express').Router();

router.use('/keyword', require('./keyword'));
router.use('/address', require('./address'));

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
