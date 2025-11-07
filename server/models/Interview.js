const mongoose = require('mongoose');
const interviewSchema = new mongoose.Schema({
  candidate:{type:mongoose.Schema.Types.ObjectId, ref:'Candidate'},
  position:{type:mongoose.Schema.Types.ObjectId, ref:'Position'},
  date:Date, type:String, location:String, itinerary:String, status:{type:String, default:'scheduled'}
},{timestamps:true});
module.exports = mongoose.model('Interview', interviewSchema);
