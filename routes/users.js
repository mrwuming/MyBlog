var express = require('express');
var md5 = require("md5");
var router = express.Router();
var userModel = global.Model("users");
var userProxy = require("../proxy/user");
/**
 * 登陆
 */
router.get('/login', function (req, res) {
    res.render("users/login", {});
});
router.post('/login', function (req, res) {
    var userName = req.body.username.trim();
    var pwd = req.body.pwd.trim();
    if (userName.length <= 0 || pwd.length < 6) {
        res.send({code: 1, msg: "账号/密码格式错误"});
        return;
    }
    userProxy.login(userName, pwd, function (msgObj, user) {
        if (user) {
            req.session.isLogin = true;
            req.session.userInfo = user;
        }
        res.send(msgObj);
    });
});
/**
 * 注册
 */
router.get("/reg", function (req, res) {
    res.render("users/reg", {});
});
router.post("/reg", function (req, res) {
    var userName = req.body.username.trim();
    var email = req.body.email.trim();
    var pwd = req.body.pwd.trim();
    var pwd2 = req.body.pwd2.trim();
    if (userName.length === 0 || pwd.length < 6) {
        res.send({code: 1, msg: "账号/密码不能为空"});
        return;
    }
    if (email.length === 0) {
        res.send({code: 1, msg: "邮箱不能为空"});
        return;
    }
    if (pwd !== pwd2) {
        res.send({code: 3, msg: "密码与确认密码不一致"});
        return;
    }
    userProxy.regUser(userName, pwd,email, function (msgObj, user) {
        if (user) {
            req.session.isLogin = true;
            req.session.userInfo = user;
        }
        res.send(msgObj);
    });
});
/**
 * 退出
 */
router.get("/logout", function (req, res) {
    req.session.isLogin = false;
    req.session.userInfo = null;
    res.redirect("/users/login");
});
module.exports = router;
