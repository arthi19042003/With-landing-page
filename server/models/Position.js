const mongoose = require('mongoose');
const positionSchema = new mongoose.Schema({
  title:String, department:String, project:String, organization:String,
  skills:[String], status:{type:String, default:'open'}, description:String
},{timestamps:true});
module.exports = mongoose.model('Position', positionSchema);
