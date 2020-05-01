const express = require('express');
const router = express.Router();
const fs = require('fs');
const FILE = '\\wrks\\data\\store.txt';

router.use(timeLog = (req, res, next) => {
  console.log('Current date: ', new Date().toJSON().slice(0, 10));
  next();
});

/**
 * Handle POST-request here.
 */
  router.post('/', (req, res) => {
    fs.writeFile(FILE,JSON.stringify(req.body), (err) => {
      if (err) {
        return console.log(err);
      }
      res.send({responseLAR: "saved!"});
    } );
  });
module.exports = router;
