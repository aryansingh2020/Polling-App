const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  votedPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poll' }]
});

module.exports = mongoose.model('User', userSchema);
