# 我的博客系统
>###1.目录结构
>>model目录：用于连接、操作数据库，其中schema文件夹存储mongodb的schema，mongoModel.js为对外暴露接口
>>proxy目录：用于处理复杂逻辑，使的路由中逻辑更加清晰
>>settings.js模块，用于存储配置项，如：mongodb配置、redis配置等
>>util目录：用于存储工具模块
>>>jsExtend.js模块，用于扩展原生js功能比如：字符串的trim函数<br />
>>>logHelper.js模块，对log4js进行封装到全局变量中，方便调用

>###2.项目说明
>>a.用mongodb存储数据，用redis存储session实现session，防止重启服务后session丢失
>>b.用log4js实现错误日志的记录
>>c.用wangeditor富文本框实现文章编辑功能
>>d.在setting.js中配置允许用户匿名访问的路由，用户权限判断统一在app.js中用中间件处理
```javascript
/**
 * 验证用户权限
 */
app.use(function (req, res, next) {
    var requestPath=req.path;
    if(!req.session){
        console.log("session为空，请检查redis是否启动");
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
```javascript
>###3.配置说明
>>启动程序前先要在setting.js中配置好mongodb和redis并将二者启动，到程序目录执行npm install命令安装依赖包后即可启动bin/www，端口为3000
