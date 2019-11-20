'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/**
    회원가입 API
    @param username
    @param password
    @return code
        1: SUCCESS
        2: BAD USERNAME
        3: USERNAME EXISTS
        999: INVALID PARAM
**/
router.post('/signup', function (req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var usernameRegex = /^[a-z0-9]+$/;

    if (!username || !password) {
        return res.status(400).json({
            code: 999,
            entity: "필수 파라미터가 없습니다."
        });
    }

    if (!usernameRegex.test(username)) {
        return res.status(400).json({
            code: 2,
            entity: "잘못된 닉네임 입니다."
        });
    }

    _user2.default.findOne({ username: username }, function (err, exists) {
        if (err) throw err;

        if (exists) {
            return res.status(409).json({
                code: 3,
                entity: "이미 가입된 유저가 존재합니다."
            });
        }

        var user = new _user2.default({
            username: username,
            password: user.generateHash(password)
        });

        user.save(function (err) {
            if (err) throw err;
            return res.json({ code: 1, entity: "회원가입이 완료 되었습니다." });
        });
    });
});

/**
    로그인 API
    @param username
    @param password
    @return code
        1: SUCCESS
        2: LOGIN FAILED
        999: INVALID PARAM
**/
router.post('/signin', function (req, res) {

    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            code: 999,
            entity: "필수 파라미터가 없습니다."
        });
    }

    _user2.default.findOne({ username: username }, function (err, user) {
        if (err) throw err;

        if (!user) {
            return res.status(401).json({
                code: 2,
                entity: "로그인 실패"
            });
        }

        if (!user.validateHash(password)) {
            return res.status(401).json({
                code: 2,
                entity: "로그인 실패"
            });
        }

        var session = req.session;
        session.loginInfo = {
            _id: user._id,
            username: user.username
        };

        return res.json({ code: 1, entity: "로그인이 완료 되었습니다." });
    });
});

/**
    세션확인 API
    @return code
        1: SUCCESS
        2: NOT AUTH
**/
router.get('/getinfo', function (req, res) {

    var loginInfo = req.session.loginInfo;

    if (typeof loginInfo === "undefined") {
        return res.status(401).json({
            code: 2,
            entity: "인증정보가 없습니다."
        });
    }

    res.json({ code: 1, entity: { info: loginInfo } });
});

/**
    로그아웃 API
    @return code
        1: SUCCESS
**/
router.get('/logout', function (req, res) {

    req.session.destroy(function (err) {
        if (err) throw err;
    });
    return res.json({ code: 1, entity: "로그아웃이 완료되었습니다." });
});

exports.default = router;