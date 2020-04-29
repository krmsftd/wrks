/**
 * Оборачиваем весь контент в функцию, которую потом передаём в качестве аргумента для listener'а.
 * Делаем это для того чтобы обращаться к элементам после того как они точно созданы в DOM.
 */
const onDOMLoaded = () => {
    /**
     * Пытайся называть переменные как-то понятнее и в целом разберись какие тебе нужны, а какие нет.
     */
    const REMOVE_INPUT = document.getElementById('inputRemove');
    const REMOVE_BTN = document.getElementById('sendRemove');
    const ADD_INPUT = document.getElementById('inputAdd');
    const ADD_BTN = document.getElementById('sendAdd');

    /**
     * фуенкия send для отправки данных из input
     */
async function send() {
    //объявляем переменную URL
        const URL = 'data';
        // создаем запрос к серверу fetch, присваем результат переменной resp, await - асинхронный запрос
        const Resp = await fetch(
            URL,
            //первый агрумент URL, второй аргумент объект
        {
            method: 'post',
            // в объекте то, что передаем на node.js
            body: JSON.stringify( {InputValue:REMOVE_INPUT.value, InputValue: ADD_INPUT.value })
        }
        )
    }





};
/**
   * создаем проверку ввода для input
 */

const validateInteger = (input) => {
    if (isNaN(Number(input.value))) {
        input.value = '';
    }
};

document.addEventListener('DOMContentLoaded', onDOMLoaded);
