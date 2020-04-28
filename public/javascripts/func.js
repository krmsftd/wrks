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

    }
function inputCheck(data) {
        if ( isNaN(data.value))
        {  data.value = ""; }

    console.log('data.value=>', data.value)
}


document.addEventListener('DOMContentLoaded', onDOMLoaded);
