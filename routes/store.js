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
            res.send({ balance: 'NO DATA' });
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
        res.send({balance});
    })
});

/**
 * Объявляем POST - для записи новых данных в файл.
 */
router.post('/', (req, res) => {
    fs.readFile(PATH,'UTF-8', (err, fileData) => {
        let objectData;
        let parsedData;
        /**
         *  условие, если в filedata есть данные, то мы используем JSON распарсить из баффера, после добавляем в parsedData
         то, что было передано
         */
        if (fileData) {
            parsedData = JSON.parse(fileData);
            /**
             * проверка parsedData по полям
             */
            if (parsedData.expenses && req.body.expenses) {
                let numParcedData = Number(parsedData.expenses);
                let numReqBody = Number(req.body.expenses);
               parsedData.expenses = numParcedData + numReqBody;
              }
            else if
             (parsedData.income && req.body.income)
            {
                let numParcedData = Number(parsedData.income);
                let numReqBody = Number(req.body.income);
                parsedData.income = numParcedData + numReqBody;
            }
            else {
                Object.assign(parsedData, req.body);
            }
           }
         /**
         *   если данных нет,файл пустой, то добавляем в него то, что было передано
         */
        else
                   {
            objectData= {};
            Object.assign(objectData,req.body);
            }
        /**
         *  используем writeFile, что бы записать файл, в аргументах массивы objectData||parsedData
         */
        fs.writeFile(PATH,JSON.stringify(objectData || parsedData), (err) => {
            if (err) {
                return console.error(err);
            }
            res.send({ ok: true });
        });
    });
});

module.exports = router;
