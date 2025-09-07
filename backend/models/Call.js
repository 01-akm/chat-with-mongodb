const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  callerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  callType: {
    type: String,
    enum: ['voice', 'video'],
    required: true,
  },
  status: {
    type: String,
    enum: ['ongoing', 'missed', 'ended'],
    default: 'ongoing',
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
});

const Call = mongoose.model('Call', callSchema);

module.exports = Call;