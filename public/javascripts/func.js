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
            /**
             *
             */
        } else {
            /**
             *
             */
        }
    };
    /**
     * Создаём метод для получения текущего баланса.
     */
    this.getBalance = async () => {
        const response = await fetch(API_URL,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.ok) {
            const result = await response.json();
            BALANCE.innerHTML = result.balance;
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
