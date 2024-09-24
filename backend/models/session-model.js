const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  questions: { type: [String], required: true },
  answers: { type: [String], required: true },
  currentQuestionIndex: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
});

module.exports = mongoose.model("Session", SessionSchema);
