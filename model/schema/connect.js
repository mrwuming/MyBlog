var mongoose = require('mongoose');
var settings = require('../../settings');

mongoose.connect("mongodb://"+settings.mongodb.host+":"+settings.mongodb.port+"/"+settings.mongodb.dbName);

module.exports=mongoose;