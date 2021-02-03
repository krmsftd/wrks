const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const storeRouter = require('./routes/store');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

/** создаем сервер дял вебсокета, через require запрашиваем пакет Websocket - 'ws' */
const Websocket = require('ws');
/**создаем переменную WebsocketServer через конструктор new и метод .Server, устанавливаем
 * порт для  подключения из frontend
 */
const WebsocketServer = new Websocket.Server ({port: 4040});
/** используем метод on для включения, указываем событие 'connection' , в cb передаем аргумент
 * socket, используем метод on, указываем событие месседж, для принятий сообщений
 */
WebsocketServer.on('connection', (socket) => {
    socket.on('message', (message) => {
       messageSend(message)
    })
});

const messageSend = (message) => {
    console.log('message=>', message);
    WebsocketServer.clients.forEach (client => {
        if (Websocket.OPEN === client.readyState) {
            client.send(message)
        }
    })
};


app.use('/store', storeRouter);
app.listen(3333, () => console.log('App is up.'));
module.exports = app;
