/**
 * Допустим дефолтный роут на сервере.
 */
const SERVER_URL = 'data';

/**
 * Оборачиваем весь контент в функцию, которую потом передаём в качестве аргумента для listener'а.
 * Делаем это для того чтобы обращаться к элементам после того как они точно созданы в DOM.
 */
const onDOMLoaded = () => {
    /**
     * Пытайся называть переменные как-то понятнее и в целом разберись какие тебе нужны, а какие нет.
     */
    const INCOME_INPUT = document.getElementById('inputIncome');
    const REMOVE_BTN = document.getElementById('sendRemove');
    const EXPENSES_INPUT = document.getElementById('inputExpenses');
    const ADD_BTN = document.getElementById('sendAdd');
    /**
     * Условия срабатывания input, button
     */
    REMOVE_BTN.addEventListener('click' , send)
    ADD_BTN.addEventListener('click', send)

    /**
     * Для отправки данных на сервер.
     */
    async function send() {
        /* Создаем запрос к серверу fetch, присваиваем результат переменной response, await - асинхронный запрос. */
        /* Первый аргумент URL, второй аргумент передаваемый объект. */
        const response = await fetch(
            SERVER_URL,
            {
                method: 'post',
                // в объекте то, что передаем на node.js
                body: JSON.stringify( {
                    income: INCOME_INPUT.value,
                    expenses: EXPENSES_INPUT.value
                })
            }
        )
    }
};
/**
 * Для валидации введённых значений в инпут.
 */
const validateInteger = (input) => {
    if (isNaN(Number(input.value))) {
        input.value = '';
    }
};

document.addEventListener('DOMContentLoaded', onDOMLoaded);
