/**
 * Основной роут на сервере.
 */
const SERVER_URL = 'store';

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
    const EXPENSES_BTN = document.getElementById('btn-expenses');
    const INCOME_BTN = document.getElementById('btn-income');
    const TOTAL_BTN = document.getElementById('btn-total');
    const BALANCE = document.getElementById('balance');
    TOTAL_BTN.addEventListener('click',show);

    /**
     * Создаём главный метод для отправки новых данных на сервер.
     * @param {Object} body
     */
    const send = async (body) => {
        /**
         * Создаем асинхронный запрос (async/await) к серверу с помощью fetch, присваиваем результат переменной response.
         * Первый аргумент URL, второй аргумент - передаваемый объект.
         */
        const response = await fetch(SERVER_URL,
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
    async function show() {
        const response = await  fetch(SERVER_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        } );
        if (response.ok) {
            let total = await response.json();
            console.log('response=>', response);
            console.log('total=>', total);
            document.getElementById('balance').innerHTML = total.balance
        }
    }
};
document.addEventListener('DOMContentLoaded', onDOMLoaded);
