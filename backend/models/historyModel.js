const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  entityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  }, 
  entityType: { 
    type: String, enum: ["task", "project"], 
    required: true 
  }, 
  changeType: { 
    type: String, 
    required: true 
  }, 
  changedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "User" 
  }, 
  changedAt: { 
    type: Date, 
    default: Date.now 
  },
  previousState: { 
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }, 
  newState: { 
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }, 
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

const HistoryModel = mongoose.model("History", historySchema);

module.exports = HistoryModel;
