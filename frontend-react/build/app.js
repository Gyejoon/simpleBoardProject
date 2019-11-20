'use strict';

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _config2 = require('./config/config');

var _config3 = _interopRequireDefault(_config2);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.set('port', _config3.default.port);
app.set('devPort', _config3.default.devPort);
app.set('dbUri', _config3.default.dbUri);

app.use('/', _express2.default.static(_path2.default.join(__dirname, '../public')));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use((0, _cookieParser2.default)());
app.use((0, _expressSession2.default)({
    key: 's&@5imp&1fe&a',
    secret: 's!i@m#p$l%e&',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

var db = _mongoose2.default.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log('Connected to mongodb server');
});
_mongoose2.default.connect(app.get('dbUri'));

app.use('/api', _routes2.default);
app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, '../public/index.html'));
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ code: 500, entity: 'Server Error' });
});

process.on('uncaughtException', function (err) {
    console.error(err.stack);
});

app.listen(app.get('port'), function () {
    console.log('Express is listening on port', app.get('port'));
});

if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    var _config = require('../webpack.dev.config');
    var compiler = (0, _webpack2.default)(_config);
    var devServer = new _webpackDevServer2.default(compiler, devServer);
    devServer.listen(app.get('devPort'), function () {
        console.log('webpack-dev-server is listening on port', app.get('devPort'));
    });
}