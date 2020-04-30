const express = require('express');
const router = express.Router();

router.use(timeLog = (req, res, next) => {
  console.log('Current date: ', new Date().toJSON().slice(0, 10));
  next();
});

/**
 * Handle POST-request here.
 */

module.exports = router;
