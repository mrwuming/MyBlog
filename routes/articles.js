var express = require("express");
var multer = require('multer');
var async = require('async');
var router = express.Router();
var articleModel = global.Model("articles");
//指定文件元素的存储方式
var storage = multer.diskStorage({
    //保存文件的路径
    destination: function (req, file, cb) {
        //判断是否存在upload目录，如果不存在创建
        if (!fs.existsSync("../public/upload")) {
            fs.mkdirSync("../public/upload");
        }
        cb(null, '../public/upload')
    },
    //指定保存的文件名
    filename: function (req, file, cb) {
        console.error(file);
        cb(null, Date.now() + '.' + file.mimetype.slice(file.mimetype.indexOf('/') + 1))
    }
});
var upload = multer({storage: storage});
/**
 * 添加文章
 */
router.get("/add", function (req, res) {
    res.render("articles/add", {});
});
router.post("/add", upload.single('img'), function (req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var article = {user: req.session.userInfo._id, title: title, content: content};
    if (req.file) {
        //存在图片
        article.img = "/upload/" + req.file.filename;
    }
    articleModel.create(article, function (err, doc) {
        if (err) {
            req.flash("error", "发表文章失败");
            res.redirect("back");
        } else {
            req.flash("success", "发表文章成功");
            res.redirect("/");
        }
    });
});
/**
 * 文章详细页面
 */
router.get("/detail/:id", function (req, res) {
    var id = req.params.id;
    async.parallel(
        [
            function (callback) {
                articleModel.findOne({_id: id})
                    .populate('user')
                    .populate('comments.user')
                    .exec(function (err, article) {

                        callback(err, article);
                    });
            },
            function (callback) {
                articleModel.update({_id: id}, {$inc: {pv: 1}}, callback);
            }
        ],
        function (err, result) {
            if (err) {
                req.flash('error', err);
                res.redirect('back');
            }
            var author = false;
            if (req.session.userInfo._id === result[0].user._id.toString()) {
                author = true;
            }
            res.render("articles/detail", {article: result[0], author: author});
        });
});
/**
 * 删除文章
 */
router.get("/delete/:id", function (req, res) {
    articleModel.findById(req.params.id, function (err, doc) {
        if (doc.user.toString() === req.session.userInfo._id) {
            articleModel.remove({_id: req.params.id}, function (err, result) {
                if (err) {
                    req.flash('error', '删除失败');
                    res.redirect('back');
                } else {
                    req.flash('success', '删除成功');
                    res.redirect('/');
                }
            });
        } else {
            req.flash('error', '您没有权限删除该文章');
            res.redirect('back');
        }

    });
});
/**
 * 修改文章页面
 */
router.get("/update/:id", function (req, res) {
    articleModel.findById(req.params.id, function (err, article) {
        res.render('articles/update', {article: article});
    });
});
router.post("/update", upload.single('img'), function (req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var id=req.body.id;
    articleModel.findById(id, function (err, doc) {
        if (doc.user.toString() === req.session.userInfo._id) {
            var set = {title:title,content:content};
            if(req.file){//如果新上传了文件，那么更新img字段
                set.img = '/upload/'+req.file.filename;
            }
            articleModel.update({_id:id},{$set:set},function(err,article){
                if(err){
                    req.flash('error','更新文章失败');
                    return res.redirect('back');
                }else{
                    req.flash('success','更新文章成功');
                    return res.redirect('/');
                }
            });
        }else{
            req.flash('error','您没有权限修改文章');
            return res.redirect('back');
        }
    });
});
/**
 * 评论功能
 */
router.post("/comment/:id", function (req, res) {
    var articleId = req.params.id;
    var content = req.body.content;
    if (content.length <= 0) {
        req.flash('error', "评论内容不能为空");
        return res.redirect('back');
    }
    articleModel.update({_id: articleId}, {
        $push: {
            comments: {
                user: req.session.userInfo._id,
                content: content
            }
        }
    }, function (err, doc) {
        if (err) {
            req.flash('error', JSON.stringify(err));
            return res.redirect('back');
        }
        req.flash('success', '评论成功!');
        res.redirect('back');
    })
});


module.exports = router;