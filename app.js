const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const storeRouter = require('./routes/store');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

/** создаем сервер дял вебсокета, через require запрашиваем пакет Websocket - 'ws' */
const Websocket = require('ws');
/**создаем переменную WebsocketServer через конструктор new и метод .Server, устанавливаем
 * порт для  подключения из frontend
 */
const WebsocketServer = new Websocket.Server({port: 4040});

const COLOR_DATA = ['#6495ED', '#DC143C', '#8FBC8F', '#FF00FF', '#D8BFD8', '#4169E1', '#FFFACD',
    '#3D9970', '#FFDC00', '#DDDDDD'];
const USERS = [
    {name: 'anonym', color: '#6495ED'}
];
/** используем метод on для включения, указываем событие 'connection' , в cb передаем аргумент
 * socket, используем метод on, указываем событие месседж, для принятий сообщений
 */
WebsocketServer.on('connection', (socket) => {
    socket.on('message', (message) => {
        /** принимаем message и парсим для использования поля .name */
        let messageParsed = JSON.parse(message);

        setColorUser(messageParsed.name);
        messageSend(messageParsed);
    })
});
/**
 USERS=> [ { name: 'anonym', color: '#6495ED' },
 { name: 'karim', color: '#FFFACD' },
 { name: 'artem', color: '#FF00FF' },
 { name: 'karim', color: '#FFFACD' },
 { name: 'artem', color: '#D8BFD8' } ]
 */

const setColorUser = (userName) => {
    const userExist = USERS.find(user => user.name === userName);
    /**
     for (let i = 0; i < USERS.length; i++) {
        console.log('for=>');
        if (USERS[i].name !== userName) {
            userExist = false
        } else {
            userExist = true;
            return;
        }
    }
     */
    console.log('userName==>', userName);
    if (!userExist) {
        USERS.push({
            name: userName,
            color: COLOR_DATA[Math.floor(Math.random() * COLOR_DATA.length)]
        })
    }
};

const messageSend = (message) => {
    console.log('message=>', message, 'USERS=>', USERS);
    WebsocketServer.clients.forEach(client => {
        if (Websocket.OPEN === client.readyState) {

            message.color = USERS.find(user => user.name === message.name).color;

            client.send(JSON.stringify(message));
        }
    })
};


app.use('/store', storeRouter);
app.listen(3333, () => console.log('App is up.'));
module.exports = app;
