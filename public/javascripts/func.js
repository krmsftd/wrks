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
        } else {
            /**
             *
             */
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
        }
    };

    /**
     * Создаём метод для отрисовки графика (income/expenses).
     * Есть известный баг при перерисовке графика - иногда видно старые данные, пока что решением стало
     * объявление глобального свойства и вызов метода destroy если такое свойство уже существует.
     */
    const drawGraph = (options) => {
        const labels = [...Object.keys(options)];
        const data = [...Object.values(options)];

        if (window.newChart){
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

    getBalance().catch((err) => console.error(err));
    getBalanceKeys().catch((err) => console.error(err));

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
