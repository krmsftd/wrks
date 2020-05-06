const express = require('express');
const router = express.Router();
const fs = require('fs');

const PATH = 'store.txt';
const ENCODING = 'UTF-8';

router.use(timeLog = (req, res, next) => {
    console.log('Current date: ', new Date().toJSON().slice(0, 10));
    next();
});

/**
 * Объявляем GET - для получения ключей (income/expenses).
 */
router.get('/balance-keys', (req, res) => {
    fs.readFile(PATH, ENCODING, (err, fileData) => {
        if (err) {
            return console.error(err);
        }
        res.send(fileData);
    })
});

/**
 * Объявляем GET - для получения баланса.
 */
router.get('/balance', (req, res) => {
    fs.readFile(PATH, ENCODING, (err, fileData) => {
        if (err) {
            res.send({ balance: 'No balance data' });
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
    fs.readFile(PATH, ENCODING, (err, fileData) => {
        let newData;
        let parsedData;
        /**
         * Если в файле уже были данные, то 'объединяем' их с новыми.
         */
        if (fileData) {
            parsedData = JSON.parse(fileData);
            const key = Object.keys(req.body)[0];
            /**
             * Проверяем наличие пришедшего 'ключа' в файле.
             */
            if (parsedData.hasOwnProperty(key)) {
                parsedData[key] = Number(req.body[key]) + Number(parsedData[key]);
            } else {
                parsedData = {...parsedData, ...req.body};
            }
        } else {
            newData = {...req.body};
        }
        fs.writeFile(PATH, JSON.stringify(newData || parsedData), (err) => {
            if (err) {
                return console.error(err);
            }
            res.send({ ok: true });
        });
    });
});

module.exports = router;
