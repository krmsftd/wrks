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
/**
 * создание роутера get, для получения данных баланса из файла
 */
router.get('/', (req, res) => {
    fs.readFile(PATH, 'UTF-8',(err, fileData) =>{
        if (err) {
            return console.log('router.get/err=>', err)
        }
        let parcedData;
        parcedData = JSON.parse(fileData);
        let expenses = parcedData.expenses;
        let income = parcedData.income;
        let balance = 0;
        if (expenses != null && income != null) {
            balance = income - expenses
            }
        if (expenses != null && income == null) {
            balance = - expenses
        }
        if (expenses == null && income != null) {
            balance = + income
        }
        console.log('balance', balance);

        console.log('parcedData=>', parcedData);
        console.log('expenses=>', expenses);
        console.log('income', income);
        res.send({balance});
    } )
});
module.exports = router;
