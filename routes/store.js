const express = require('express');
const router = express.Router();
const fs = require('fs');

const PATH = 'store.txt';

router.use(timeLog = (req, res, next) => {
    console.log('Current date: ', new Date().toJSON().slice(0, 10));
    next();
});

/**
 * Объявляем GET - для получения баланса.
 */
router.get('/', (req, res) => {
    fs.readFile(PATH, 'UTF-8',(err, fileData) =>{
        if (err) {
            return console.error(err);
        }
        const parsedData = JSON.parse(fileData);
        const expenses = parsedData.expenses;
        const income = parsedData.income;
        /**
         * Вычисляем баланс, используя распарсенные данные файла.
         */
        let balance = 0;
        if (!!expenses && !!income) {
            balance = income - expenses;
        }
        if (!!expenses && !income) {
            balance = -expenses;
        }
        if (!!income && !expenses) {
            balance = income;
        }
        res.send({ balance });
    })
});

/**
 * Объявляем POST - для записи новых данных в файл.
 */
router.post('/', (req, res) => {
    fs.writeFile(PATH, JSON.stringify(req.body), (err) => {
        if (err) {
            return console.error(err);
        }
        res.send({ ok: true });
    });
});

module.exports = router;
