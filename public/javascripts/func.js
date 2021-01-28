/**
 * Основной роут на сервере.
 */
const API_URL = 'store';

/**
 * Оборачиваем весь контент в функцию, которую потом передаём в качестве аргумента для listener'а.
 * Делаем это для того чтобы обращаться к элементам после того как они точно созданы в DOM.
 */
const onDOMLoaded = () => {
    /**
     * Объявляем необходимые переменные для работы с HTML-элементами.
     */
    const INCOME_INPUT = document.getElementById('input-income');
    const EXPENSES_INPUT = document.getElementById('input-expenses');
    const BALANCE = document.getElementById('balance');
    const CHART = document.getElementById('chart').getContext('2d');
    const BALANCE_STORE_INCOME = document.getElementById('balance-store-income');
    const BALANCE_STORE_EXPENSES = document.getElementById('balance-store-expenses');

    let lastBalanceKeys;

    /**
     * Добавляем отправку данных по клавише Enter.
     */
    INCOME_INPUT.addEventListener('keypress', (e) => e.code === 'Enter' ? this.sendIncome() : null);
    EXPENSES_INPUT.addEventListener('keypress', (e) => e.code === 'Enter' ? this.sendExpenses() : null);

    /**
     * Создаём главный метод для отправки новых данных на сервер.
     * @param {Object} body
     */
    const send = async (body) => {
        /**
         * Проверяем наличие данных для запроса.
         */
        if (!Object.values(body)[0]) {
            return;
        }

        /**
         * Создаём асинхронный запрос (async/await) к серверу с помощью fetch, присваиваем результат переменной response.
         * Первый аргумент URL, второй аргумент - передаваемый объект.
         */
        const response = await fetch(API_URL,
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        EXPENSES_INPUT.value = INCOME_INPUT.value = '';

        if (response.ok) {
            await getBalance();
            await getBalanceKeys();
        }
    };

    /**
     * Создаём метод для получения текущего баланса.
     */
    const getBalance = async () => {
        const response = await fetch(API_URL + '/balance');

        if (response.ok) {
            const result = await response.json();
            BALANCE.innerHTML = result.balance;
        }
    };

    /**
     * Создаем метод для получения ключей (income/expenses).
     */
    const getBalanceKeys = async () => {
        const response = await fetch(API_URL + '/balance-keys');

        if (response.ok) {
            const result = await response.json();
            drawGraph(result);
            lastBalanceKeys = result;
        }
    };

    /**
     * Создаём метод для отрисовки графика (income/expenses).
     * Есть известный баг при перерисовке графика - иногда видно старые данные, пока что решением стало
     * объявление глобального свойства и вызов метода destroy если такое свойство уже существует.
     * @param {Object} options
     */
    const drawGraph = (options) => {
        const labels = [...Object.keys(options)];
        const data = [...Object.values(options)];

        if (window.newChart) {
            window.newChart.destroy();
        }

        window.newChart = new Chart(CHART, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: ['green', 'red'],
                    borderWidth: 0
                }]
            },
            options: {}
        });
    };

    const toggleBalanceKeysOpacity = (opacity) => {
        BALANCE_STORE_INCOME.style.opacity = BALANCE_STORE_EXPENSES.style.opacity = opacity;
    };

    const hideBalanceKeys = () => {
        toggleBalanceKeysOpacity('1');
        setTimeout(() => toggleBalanceKeysOpacity('0'), 3000);
    };

    getBalance().catch((err) => console.error(err));
    getBalanceKeys().catch((err) => console.error(err));

    /**
     * Создаём метод для отображения данных с полей income/expenses.
     * Временное объёмное решение, для показа правильного прямолинейного результата.
     * [По-прежнему пока что нет синхронного обновления ключей - будет следующей фичей]
     */
    this.showBalanceKeys = () => {
        hideBalanceKeys();

        if (!lastBalanceKeys) {
            BALANCE_STORE_INCOME.innerHTML = BALANCE_STORE_EXPENSES.innerHTML = '';
        } else {
            if (!!lastBalanceKeys.income && !lastBalanceKeys.expenses) {
                BALANCE_STORE_INCOME.innerHTML = `Income: +${lastBalanceKeys.income}`;
                BALANCE_STORE_EXPENSES.innerHTML = 'Expenses: 0';
            } else if (!!lastBalanceKeys.expenses && !lastBalanceKeys.income) {
                BALANCE_STORE_EXPENSES.innerHTML = `Expenses: -${lastBalanceKeys.expenses}`;
                BALANCE_STORE_INCOME.innerHTML = 'Income: 0';
            } else {
                BALANCE_STORE_INCOME.innerHTML = `Income: +${lastBalanceKeys.income}`;
                BALANCE_STORE_EXPENSES.innerHTML = `Expenses: -${lastBalanceKeys.expenses}`;
            }
        }
    };

    this.sendExpenses = () => send({expenses: EXPENSES_INPUT.value});
    this.sendIncome = () => send({income: INCOME_INPUT.value});

    /**
     * Валидируем введённые значения в инпут - нас интересуют только числа.
     * @param {HTMLInputElement} input
     */
    this.validateInteger = (input) => {
        if (isNaN(Number(input.value))) {
            input.value = '';
        }
    };
    /**  Приложение Password Generator
     */
    /** Привязываем переменные к указанным селекторам */
    let range = document.querySelector('.input-range');
    let rangeNum = document.querySelector('.range-num');
    let inputPass = document.querySelector('#input-pass');

    rangeNum.style.left = '-91px';
    rangeNum.innerHTML = '1';

    range.oninput = function () {
        rangeNum.style.left = this.value - 10 + '1px';
        console.log('this.value =>>', this.value);
        rangeNum.innerHTML = this.value;
    };

    let arr_num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let arr_en = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let arr_EN = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let arr_symb = ['!', '@', '#', '$', '%', '?', '-', '+', '=', '~'];

    const compareRandom = () => Math.random() - 0.5;
    const randomInteger = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1));

    const generatePassword = () => {
        let arr = [];
        if (document.querySelector('#arr_num').checked) arr = arr.concat(arr_num);
        if (document.querySelector('#arr_en').checked) arr = arr.concat(arr_en);
        if (document.querySelector('#arr_en_up').checked) arr = arr.concat(arr_EN);
        if (document.querySelector('#arr_symbols').checked) arr = arr.concat(arr_symb);

        arr.sort(compareRandom);
        console.log('arr=>>', arr);
        let password = '';
        let passLength = rangeNum.innerHTML;

        if (!arr.length) {
            inputPass.value = 'Укажите символы';
        } else {
            for (let i = 0; i < passLength; i++) {
                let int = randomInteger(0, arr.length - 1);
                console.log('int=>>', int);
                password += arr[int];
            }
            inputPass.value = password;
        }
    };
    document.querySelector('#btn-pass-generate').addEventListener('click', generatePassword);
};

document.addEventListener('DOMContentLoaded', onDOMLoaded);
