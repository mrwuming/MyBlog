var express = require('express');
var settings=require("../settings");
var router = express.Router();
var articleModel=global.Model("articles");
/**
 * 首页，显示文章列表
 */
router.get('/', function(req, res) {
  var query={};
  var keyword=(req.query.keyword||"").trim();
  var pageNo=parseInt(req.query.pageno||"1");
  var pageSize=parseInt(req.query.pagesize||settings.pageSize);
  if(keyword.length>0){
    query.title = new RegExp(keyword,"i");
  }
  articleModel.count(query,function (err,count) {
    if(err){
      req.flash('error', err);
      res.redirect('back');
    }else{
      articleModel.find(query)
          .sort({createTime:-1})
          .skip((pageNo-1)*pageSize).limit(pageSize)
          .populate("user")
          .exec(function (err, docs) {
            if(err){
              req.flash('error', err);
              res.redirect('back');
            }else{
              docs.forEach(function (doc) {
                doc.content=removeHTMLTag(doc.content);
              });
              res.render("index",{
                pageNum:pageNo,
                pageSize:pageSize,
                keyword:keyword,
                totalPage:Math.ceil(count/pageSize),
                articles:docs
              });
            }
          });
    }
  });
});
//过滤html标签，病返回指定字数摘要内容
function removeHTMLTag(str) {
  str = str.replace(/<\/?[^>]*>/g,'');
  str = str.replace(/[ | ]*\n/g,'\n');
  str = str.replace(/\n[\s| | ]*\r/g,'\n');
   str= str.replace(/ /ig,'').substr(0,300);
  return str+"...";
}
module.exports = router;
