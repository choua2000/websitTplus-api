import express from 'express'
import path from 'path'
import logger from 'morgan'
import cors from 'cors'
import { sequelize } from './models'
import cookieParser from 'cookie-parser'
import createError from 'http-errors'
import helmet from 'helmet'
import passport from 'passport'
require('dotenv').config();
require('./libs/utils/passportJwt');
// require('./libs/utils/passportJwt');
// import passportConfig from './libs/utils/passportJwt';

import indexRouter from './routes/index';
import router from './routes/user.Route'

import { Server } from 'socket.io';

const app = express();

const corsOption = {
    origin: '*',
}

app.use(helmet());
app.use(cors(corsOption));
app.use(passport.initialize());
// app.use(passport.session());
// app.use(passportConfig.initialize());

app.use(logger('dev'));
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', indexRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404, 'Not found'));
});

// error handler
app.use((err, req, res, next) => {
    // console.error(err);
    res.status(err.status || 500);
    res.send({
        error: {
            success: false,
            status: err.status || 500,
            message: err.message
        }
    });
});

sequelize
    .authenticate()
    .then(() => {
        console.log('... Connection has been established successfully ...');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const port = process.env.PORT
const IP = process.env.IP
const server = app.listen(port, IP, () => {
    console.log(`app is running on port:http://${IP}:${port}`);
});
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

app.set('socketio', io);
io.on("connection", (socket) => {
    //  console.log(socketIO);
    console.log("socket is connected id:" + socket.id);
    app.set('socket', socket);
    //  console.log(socket)
    socket.on("join_channel", function (channel) {
        if (channel != null) {

            socket.join(channel);
            console.log(`\n ${socket.id} is join ${channel} \n`);
        }

    })
    socket.on("leave_channel", function (channel) {
        if (channel != null) {
            socket.leave(channel);
            console.log(`\n ${socket.id} is leaving ${channel} \n`);
        }
    });

})


//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//                                    ("`-''-/").___..--''"`-._
//                                 `6_ 6  )   `-.  (     ).`-.__.`)
//                                 (_Y_.)'  ._   )  `._ `. ``-..-`
//                                  _..`--'_..-_/  /--'_.' ,'
//                                 (il),-''  (li),'  ((!.-'
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//
//


