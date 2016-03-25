var md5 = require("md5");
var userModel = global.Model("users");
var userProxy = {};
/**
 * 注册用户逻辑
 * @param userName
 * @param pwd
 * @param callBack
 */
userProxy.regUser = function (userName, pwd, email, callBack) {
    userModel.findOne({username: userName}, function (err, doc) {
        if (doc) {
            callBack({code: 2, msg: "已经存在该用户名"});
        } else {
            pwd = md5(pwd);
            var avatar = 'https://secure.gravatar.com/avatar/' + md5(email);
            userModel.create({username: userName, password: pwd, email: email, avatar: avatar},
                function (err, doc) {
                    if (err) {
                        global.logger.writeErr(err);
                        callBack({code: -1, msg: "未知错误"});
                    } else {
                        callBack({code: 0, msg: "ok"}, doc);
                    }
                });
        }
    });
}
/**
 * 用户登陆逻辑
 * @param userName
 * @param pwd
 * @param callBack
 */
userProxy.login = function (userName, pwd, callBack) {
    pwd = md5(pwd);
    userModel.findOne({username: userName, password: pwd}, function (err, doc) {
        if (err) {
            global.logger.writeErr(err);
            callBack({code: -1, msg: "未知错误"});
        } else {
            if (doc) {
                callBack({code: 0, msg: "ok"}, doc);
            } else {
                callBack({code: 5, msg: "用户名/密码错误"});
            }
        }
    });
}
module.exports = userProxy;