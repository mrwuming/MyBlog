var express = require("express");
var formidable = require("formidable");
var fs = require('fs');
var router = express.Router();

router.post("/", function (req, res) {
    var exist = fs.existsSync("../public/upload");
    if (!exist) {
        fs.mkdirSync("../public/upload");
    }
    // 使用第三方的 formidable 插件初始化一个 form 对象
    var form = new formidable.IncomingForm({uploadDir: "../public/upload"});
    // 处理 request
    form.parse(req, function (err, fields, files) {
        if (err) {
            global.writeErr(err);
            res.send({});
            return;
        }
        var item;
        // 计算 files 长度
        var length = 0;
        for (item in files) {
            length++;
        }
        if (length === 0) {
            res.send({});
            return;
        }

        for (item in files) {
            var file = files[item];
            // formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
            var tempfilepath = file.path;
            // 获取文件类型
            var type = file.type;
            // 获取文件名，并根据文件名获取扩展名
            var filename = file.name;
            var extname = filename.lastIndexOf('.') >= 0
                ? filename.slice(filename.lastIndexOf('.') - filename.length)
                : '';
            // 文件名没有扩展名时候，则从文件类型中取扩展名
            if (extname === '' && type.indexOf('/') >= 0) {
                extname = '.' + type.split('/')[1];
            }
            // 将文件名重新赋值为一个随机数（避免文件重名）
            filename = Date.now()+Math.random().toString().slice(2) + extname;
            // 构建将要存储的文件的路径
            var filenewpath = "../public/upload/" + filename;
            // 将临时文件保存为正式的文件
            fs.rename(tempfilepath, filenewpath, function (err) {
                // 存储结果
                var result = '';
                if (err) {
                    // 发生错误
                    result = 'error|save error';
                    logger.writeErr("保存文件错误", err);
                } else {
                    // 保存成功
                    // 拼接图片url地址
                    result = '/upload/' + filename;
                }
                // 返回结果
                res.writeHead(200, {
                    'Content-type': 'text/html'
                });
                res.end(result);
            });
        }
    });
});
module.exports = router;