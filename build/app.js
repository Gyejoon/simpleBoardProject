'use strict';

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var db = _mongoose2.default.connection;
db.on('error', console.error);
db.once('openUri', function () {
    console.log('Connected to mongodb server');
});
_mongoose2.default.connect(_config3.default.dbUri);

app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public')));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());

app.get('/hello', function (req, res) {
    return res.send('Hello World');
});

app.listen(_config3.default.port, function () {
    console.log('Express is listening on port', _config3.default.port);
});

if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    var _config = require('../webpack.dev.config');
    var compiler = (0, _webpack2.default)(_config);
    var devServer = new _webpackDevServer2.default(compiler, _config.devServer);
    devServer.listen(_config.devPort, function () {
        console.log('webpack-dev-server is listening on port', _config.devPort);
    });
}