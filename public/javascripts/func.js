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
    const INCOME_INPUT = document.getElementById('inputIncome');
    const EXPENSES_BTN = document.getElementById('btnExpenses');
    const EXPENSES_INPUT = document.getElementById('inputExpenses');
    const INCOME_BTN = document.getElementById('btnIncome');

    /**
     * Создаем асинхронный запрос (async/await) к серверу с помощью fetch, присваиваем результат переменной response.
     * Первый аргумент URL, второй аргумент - передаваемый объект.
     */
    const send = async () => {
        const response = await fetch(SERVER_URL,
            {
                method: 'POST',
                body: JSON.stringify( {
                    income: INCOME_INPUT.value,
                    expenses: EXPENSES_INPUT.value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
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
     * Навешиваем обработчики кликов на кнопки.
     */
    EXPENSES_BTN.addEventListener('click', send);
    INCOME_BTN.addEventListener('click', send);
};

/**
 * Валидируем введённые значения в инпут - нас интересуют только числа.
 * @param {HTMLInputElement} input
 */
const validateInteger = (input) => {
    if (isNaN(Number(input.value))) {
        input.value = '';
    }
};

document.addEventListener('DOMContentLoaded', onDOMLoaded);
