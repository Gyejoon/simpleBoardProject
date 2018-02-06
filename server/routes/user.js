import express from 'express';
import User from '../models/user';

const router = express.Router();

/**
    회원가입 API
    @param username
    @param password
    @return error code
        1: SUCCESS
        2: BAD USERNAME
        3: USERNAME EXISTS
        999: INVALID PARAM
**/
router.put('/signup', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;
    let usernameRegex = /^[a-z0-9]+$/;

    if(!username || !password){
        return res.status(400).json({
            code: 999,
            entity: "필수 파라미터가 없습니다."
        });
    }

    if(!usernameRegex.test(username)) {
        return res.status(400).json({
            code: 2,
            entity: "잘못된 닉네임 입니다."
        });
    }

    User.findOne({ username: username}, (err, exists) => {
        if(err) throw err;

        if(exists) {
            return res.status(409).json({
                code: 3,
                entity: "이미 가입된 유저가 존재합니다."
            });
        }

        let user = new User({
            username: username,
            password: password
        });

        user.password = user.generateHash(user.password);

        user.save( (err) => {
            if(err) throw err;
            return res.json({ code: 1, entity: "회원가입이 완료 되었습니다." });
        });
    });

});

/**
    로그인 API
    @param username
    @param password
    @return error code
        1: SUCCESS
        2: LOGIN FAILED
        999: INVALID PARAM
**/
router.post('/signin', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    if(!username || !password){
        return res.status(400).json({
            code: 999,
            entity: "필수 파라미터가 없습니다."
        });
    }

    User.findOne({ username: username}, (err, user) => {
        if(err) throw err;

        if(!user) {
            return res.status(401).json({
                code: 2,
                entity: "로그인 실패"
            });
        }

        if(!user.validateHash(password)){
            return res.status(401).json({
                code: 2,
                entity: "로그인 실패"
            });
        }

        let session = req.session;
        session.loginInfo = {
            _id: user._id,
            username: user.username
        };

        return res.json({ code: 1, entity: "로그인이 완료 되었습니다."});
    });

});

/**
    세션확인 API
    @return error code
        1: SUCCESS
        2: NOT AUTH
        999: INVALID PARAM
**/
router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            code: 2,
            entity: "인증이 필요 합니다."
        });
    }

    res.json({ code: 1, entity: {info: req.session.loginInfo} });
});

router.delete('/logout', (req, res) => {
    req.session.destroy(err => { if(err) throw err; });
    return res.json({ code: 1, entity: "로그아웃이 완료되었습니다." });
});

export default router;
