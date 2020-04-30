const express = require('express');
const router = express.Router();

router.use(timeLog = (req, res, next) => {
  console.log('Current date: ', new Date().toJSON().slice(0, 10));
  next();
});


/**
 * Handle POST-request here.
 */
  router.post('/', (req, res) => {
    console.log('req=>',req.body);
    res.send({responseLAR: "file was saved!"});

    console.log("ZAVELOS!");
  })
module.exports = router;
