// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var TaskSchema   = new mongoose.Schema({
  name: {type:String, required: [true, 'A name is required! ']},
  description: {type: String, default:''},
  deadline: {type: Date,required:[true,'deadline is required']},
  completed: {type: Boolean, default:false},
  assignedUser: {type: String, default:''},
  assignedUserName: {type: String, default: "unassigned"},
  dateCreated: Date
});

// Export the Mongoose model
module.exports = mongoose.model('Task', TaskSchema);