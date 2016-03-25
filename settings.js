var path=require("path");
module.exports = {
    /**
     * mongodb相关配置
     */
    mongodb: {
        host:"localhost",
        port:27017,
        dbName:"Blog"
    },
    /**
     * redis相关配置
     */
    redis: {
        host: "127.0.0.1",//主机ip
        port: 6379,//端口
        session_db:"session"
    },
    /**
     * 博客名
     */
    blogName: "珠峰博客",
    /**
     * cookie加密密钥
     */
    cookieSecret:"zhufengpeixun",
    /**
     * cookie名字
     */
    cookieName:"session-id",
    /**
     * session有效期
     */
    sessionMaxAge: 2 * 60 * 60 * 1000,
    /**
     * 可匿名访问的页面路径
     */
    unAuthPath: ["/users/login","/users/reg"],
    /**
     * 列表页面每页数据条数
     */
    pageSize:"3",
    /**
     * log4js配置项
     */
    log4jsConfig: {
        "customBaseDir": path.join(__dirname, 'log'+path.sep),
        "customDefaultAtt": {
            "type": "dateFile",
            "absolute": true,
            "alwaysIncludePattern": true
        },
        "appenders": [
            {"type": "console", "category": "console"},
            {"pattern": "debug"+path.sep+"yyyyMMdd.txt", "category": "logDebug"},
            {"pattern": "info"+path.sep+"yyyyMMdd.txt", "category": "logInfo"},
            {"pattern": "warn"+path.sep+"yyyyMMdd.txt", "category": "logWarn"},
            {"pattern": "err"+path.sep+"yyyyMMdd.txt", "category": "logErr"}
        ],
        "replaceConsole": true,
        "levels": {"logDebug": "DEBUG", "logInfo": "DEBUG", "logWarn": "DEBUG", "logErr": "DEBUG"}
    }
};
