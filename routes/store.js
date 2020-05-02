const express = require('express');
const router = express.Router();
const fs = require('fs');

const PATH = 'store.txt';

router.use(timeLog = (req, res, next) => {
    console.log('Current date: ', new Date().toJSON().slice(0, 10));
    next();
});

router.post('/', (req, res) => {
    fs.writeFile(PATH, JSON.stringify(req.body), (err) => {
        if (err) {
            return console.error(err);
        }
        res.send({ ok: true });
    });
});

module.exports = router;
