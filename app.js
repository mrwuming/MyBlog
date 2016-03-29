var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var ejs = require("ejs");
var log4js = require('log4js');
var log = require('./util/logHelper');

//初始化mongodb model
require("./model/mongoModel");
var routes = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');
var upload=require("./routes/upload");
var settings = require("./settings");

//引用js扩展模块,为原生js增加扩展函数
require("./util/jsExtend");

var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis=require("redis");
var redisClient= redis.createClient();

var app = express();
log.use(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine("html", ejs.renderFile);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// 设置 Session,用redis存储session
app.use(session({
    secret: settings.cookieSecret,//secret 用来防止篡改 cookie
    key: settings.cookieName,//key 的值为 cookie 的名字
    cookie: {maxAge: settings.sessionMaxAge},//设定 cookie 的生存期
    resave:true,
    saveUninitialized:true,
    store: new RedisStore({
        host: settings.redis.host,
        port: "6379",
        //db: settings.redis.session_db,
        client:redisClient
    })
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
//配置模板的中间件
app.use(function(req,res,next){
    //res.locals才是真正的渲染模板的对象
    res.locals.user = req.session.user;
    //flash取出来的是一个数组
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});
/**
 * 验证用户权限
 */
app.use(function (req, res, next) {
    var requestPath=req.path;
    if(!req.session){
        global.writeErr("session为空，请检查redis是否启动");
    }
    if(req.session.isLogin){
        res.locals.user=req.session.userInfo;
        //已经登录
        if(requestPath==="/users/login"||requestPath==="/users/reg"){
            res.redirect("/");
            return;
        }else{
            next();
        }
    } else{
        res.locals.user=null;
        //没有登录
        if(settings.unAuthPath.indexOf(requestPath)>=0){
            //允许匿名访问的页面
            next();
        }else {
            //不允许匿名访问页面,跳转到登录页面
            res.redirect("/users/login");
            return;
        }
    }
});
/**
 * 设置博客名
 */
app.use(function (req, res, next) {
    res.locals.blogName = settings.blogName;
    next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);
app.use("/upload",upload);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.render("404");
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        global.logger.writeErr(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
;

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    global.logger.writeErr(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
