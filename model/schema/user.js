var mongoose = require('./connect');
var Schema = mongoose.Schema;
var users={
    username:{type:String,required:true},//用户名
    password:{type:String,required:true},//密码
    email:{type:String,default:""},//邮箱
    avatar:{type:String, default:""},//头像
    createTime: {type: Date, default: Date.now} //创建时间
};
mongoose.model("users",new Schema(users));