import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';

import config from './config/config';

const app = express();

app.set('port', config.port);
app.set('devPort', config.devPort);
app.set('dbUri', config.dbUri);

app.use('/', express.static(path.join(__dirname, './../public')));
app.use(morgan('dev'));
app.use(bodyParser.json());

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () =>{
    console.log('Connected to mongodb server');
});
mongoose.connect(app.get('dbUri'));

app.use(session({
    secret: 's!i@m#p$l%e&',
    resave: false,
    saveUninitialized: true
}));

app.listen(app.get('port'), () => {
    console.log('Express is listening on port', app.get('port'));
});

if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, devServer);
    devServer.listen(
        app.get('devPort'), () => {
            console.log('webpack-dev-server is listening on port', app.get('devPort'));
        }
    );
}
