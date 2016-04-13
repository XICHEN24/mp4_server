// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema   = new mongoose.Schema({
  //name: String,
  //email: String,
  name: {type: String, required: [true, 'A name is required! ']},
  email: {type: String, required: [true, 'An email is required! '], unique: true},
  pendingTasks: {type:[String],default: []},
  dateCreated: Date
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
