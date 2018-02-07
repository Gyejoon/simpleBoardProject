'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _board = require('../models/board');

var _board2 = _interopRequireDefault(_board);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/**
    게시판 글 작성 API
    @param title
    @param contents
    @return code
        1: SUCCESS
        2: NOT LOGGED IN
        999: INVALID PARAM
**/
router.post('/', function (req, res) {

    var title = req.body.title;
    var contents = req.body.contents;
    var loginInfo = req.session.loginInfo;

    if (!title || !contents) {
        return res.status(400).json({
            code: 999,
            entity: "필수 파라미터가 없습니다."
        });
    }

    if (typeof loginInfo === 'undefined') {
        return res.status(403).json({
            code: 2,
            entity: "로그인이 필요합니다."
        });
    }

    var board = new _board2.default({
        writer: loginInfo.username,
        title: title,
        contents: contents
    });

    board.save(function (err) {
        if (err) throw err;
        return res.json({ code: 1, entity: "게시물 작성이 완료 되었습니다." });
    });
});

/**
    게시판 리스트  API
    @param title
    @param contents
    @return code
        1: SUCCESS
**/
router.get('/', function (req, res) {
    _board2.default.find().sort({ "_id": -1 }).limit(6).exec(function (err, boards) {
        if (err) throw err;
        res.json({ code: 1, entity: boards });
    });
});

/**
    게시판 조회  API
    @param id
    @return code
        1: SUCCESS
        2: NO BOARD
        999: INVALID PARAM
**/
router.get('/:id', function (req, res) {

    var id = req.params.id;

    _board2.default.findById(id, function (err, board) {
        if (err) throw err;

        if (!board) {
            return res.status(404).json({
                code: 2,
                entity: "게시물을 찾을 수 없습니다."
            });
        }

        return res.json({ code: 1, entity: board });
    });
});

/**
    게시판 글 수정 API
    @param title
    @param contents
    @return code
        1: SUCCESS
        2: NOT LOGGED IN
        3: NO BOARD
        4: PERMISSION FAILURE
        999: INVALID PARAM
**/
router.put('/:id', function (req, res) {

    var id = req.params.id;
    var title = req.body.title;
    var contents = req.body.contents;
    var loginInfo = req.session.loginInfo;

    if (!title || !contents || !id) {
        return res.status(400).json({
            code: 999,
            entity: "필수 파라미터가 없습니다."
        });
    }

    if (typeof loginInfo === 'undefined') {
        return res.status(403).json({
            code: 2,
            entity: "로그인이 필요합니다."
        });
    }

    _board2.default.findById(id, function (err, board) {
        if (err) throw err;

        if (!board) {
            return res.status(404).json({
                code: 3,
                entity: "게시물을 찾을 수 없습니다."
            });
        }

        if (board.writer != loginInfo.username) {
            return res.status(404).json({
                code: 4,
                entity: "권한이 없습니다."
            });
        }

        board.contents = contents;

        board.save(function (err, board) {
            if (err) throw err;
            return res.json({ code: 1, entity: board });
        });
    });
});

/**
    게시판 글 삭제 API
    @param id
    @return code
        1: SUCCESS
        2: NOT LOGGED IN
        3: NO BOARD
        4: PERMISSION FAILURE
        999: INVALID PARAM
**/
router.delete('/:id', function (req, res) {

    var id = req.params.id;
    var loginInfo = req.session.loginInfo;

    if (!id) {
        return res.status(400).json({
            code: 999,
            entity: "필수 파라미터가 없습니다."
        });
    }

    if (typeof loginInfo === 'undefined') {
        return res.status(403).json({
            code: 2,
            entity: "로그인이 필요합니다."
        });
    }

    _board2.default.findById(id, function (err, board) {
        if (err) throw err;

        if (!board) {
            return res.status(404).json({
                code: 3,
                entity: "게시물을 찾을 수 없습니다."
            });
        }

        if (board.writer != loginInfo.username) {
            return res.status(404).json({
                code: 4,
                entity: "권한이 없습니다."
            });
        }

        board.remove({ _id: id }, function (err) {
            if (err) throw err;
            return res.json({ code: 1, entity: "게시물 삭제가 완료 되었습니다." });
        });
    });
});

/**
    게시판 댓글 작성 API
    @param contents
    @param pointer
    @return code
        1: SUCCESS
        2: NOT LOGGED IN
        3: NO BOARD
        4: PERMISSION FAILURE
        999: INVALID PARAM
**/
router.post('/reply/:id', function (req, res) {

    var id = req.params.id;
    var contents = req.body.contents;
    var pointer = req.body.pointer;
    var loginInfo = req.session.loginInfo;

    if (!contents || !id) {
        return res.status(400).json({
            code: 999,
            entity: "필수 파라미터가 없습니다."
        });
    }

    if (typeof loginInfo === 'undefined') {
        return res.status(403).json({
            code: 2,
            entity: "로그인이 필요합니다."
        });
    }

    _board2.default.findById(id, function (err, board) {
        if (err) throw err;

        if (!board) {
            return res.status(404).json({
                code: 3,
                entity: "게시물을 찾을 수 없습니다."
            });
        }

        board.comments.push({
            writer: loginInfo.username,
            contents: contents,
            pointer: pointer
        });

        board.save(function (err, board) {
            if (err) throw err;
            return res.json({ code: 1, entity: board });
        });
    });
});

/**
    게시판 댓글 수정 API
    @param contents
    @param pointer
    @return code
        1: SUCCESS
        2: NOT LOGGED IN
        3: NO BOARD
        4: NO COMMENT
        5: PERMISSION FAILURE
        999: INVALID PARAM
**/
router.put('/reply/:id', function (req, res) {

    var commentid = req.params.id;
    var boardid = req.body.boardid;
    var contents = req.body.contents;
    var loginInfo = req.session.loginInfo;

    if (!contents || !commentid || !boardid) {
        return res.status(400).json({
            code: 999,
            entity: "필수 파라미터가 없습니다."
        });
    }

    if (typeof loginInfo === 'undefined') {
        return res.status(403).json({
            code: 2,
            entity: "로그인이 필요합니다."
        });
    }

    _board2.default.findOne({ _id: boardid }, { comments: { $elemMatch: { _id: commentid } } }, function (err, board) {
        if (err) throw err;

        if (!board) {
            return res.status(404).json({
                code: 3,
                entity: "게시물을 찾을 수 없습니다."
            });
        }

        if (!board.comments[0]) {
            return res.status(404).json({
                code: 4,
                entity: "댓글을 찾을 수 없습니다."
            });
        }

        if (board.comments[0].writer != loginInfo.username) {
            return res.status(404).json({
                code: 5,
                entity: "권한이 없습니다."
            });
        }

        board.comments[0].contents = contents;

        board.save(function (err, board) {
            if (err) throw err;
            return res.json({ code: 1, entity: board });
        });
    });
});

/**
    게시판 댓글 삭제 API
    @param contents
    @param pointer
    @return code
        1: SUCCESS
        2: NOT LOGGED IN
        3: NO BOARD
        4: No COMMENT
        5: PERMISSION FAILURE
        999: INVALID PARAM
**/
router.delete('/reply/:id', function (req, res) {

    var commentid = req.params.id;
    var boardid = req.body.boardid;
    var contents = req.body.contents;
    var loginInfo = req.session.loginInfo;

    if (!contents || !commentid || !boardid) {
        return res.status(400).json({
            code: 999,
            entity: "필수 파라미터가 없습니다."
        });
    }

    if (typeof loginInfo === 'undefined') {
        return res.status(403).json({
            code: 2,
            entity: "로그인이 필요합니다."
        });
    }

    _board2.default.findOne({ _id: boardid }, { comments: { $elemMatch: { _id: commentid } } }, function (err, board) {
        if (err) throw err;

        if (!board) {
            return res.status(404).json({
                code: 3,
                entity: "게시물을 찾을 수 없습니다."
            });
        }

        if (!board.comments[0]) {
            return res.status(404).json({
                code: 4,
                entity: "댓글을 찾을 수 없습니다."
            });
        }

        if (board.comments[0].writer != loginInfo.username) {
            return res.status(404).json({
                code: 5,
                entity: "권한이 없습니다."
            });
        }

        board.delete({ comments: { $elemMatch: { _id: commentid } } }, function (err) {
            if (err) throw err;
            return res.json({ code: 1, entity: "게시물 삭제가 완료 되었습니다." });
        });
    });
});

exports.default = router;