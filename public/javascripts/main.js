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

    this.sendExpenses = () => send({ expenses: EXPENSES_INPUT.value });
    this.sendIncome = () => send({ income: INCOME_INPUT.value });

    /**
     * Валидируем введённые значения в инпут - нас интересуют только числа.
     * @param {HTMLInputElement} input
     */
    this.validateInteger = (input) => {
        if (isNaN(Number(input.value))) {
            input.value = '';
        }
    };
};

document.addEventListener('DOMContentLoaded', onDOMLoaded);
