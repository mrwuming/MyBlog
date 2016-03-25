var mongoose = require('./connect');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var articles = {
    user: {type: ObjectId, ref: 'users'}, //用户
    title: {type: String, default: ''}, //标题
    content: {type: String, default: ''}, //内容
    img: {type: String},
    comments: [
        {
            user:{type:ObjectId,ref:'users'}, //用户
            content:{type:String,default:''}, //内容
            createTime:{type:Date,default:Date.now} //创建时间
        }
    ],
    pv: {type:Number,default:0},
    createTime: {type: Date, default: Date.now} //创建时间
};
mongoose.model("articles", new Schema(articles));