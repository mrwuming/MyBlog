var mongoose=require("./schema/connect");
require("./schema/user");
require("./schema/article");
global.Model=function (type) {
    return mongoose.model(type);
}