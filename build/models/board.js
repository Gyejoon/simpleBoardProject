'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Board = new Schema({
    writer: String,
    title: String,
    contents: String,
    comments: [{
        writer: String,
        contents: String,
        date: {
            created: { type: String, default: (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss') },
            edited: { type: String, default: (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss') }
        },
        pointer: String
    }],
    views: { type: Number, default: 0 },
    date: {
        created: { type: String, default: (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss') },
        edited: { type: String, default: (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss') }
    }
});

Board.methods.generateHash = function (username) {
    return _bcryptjs2.default.hashSync(username, 8);
};

exports.default = _mongoose2.default.model('board', Board);