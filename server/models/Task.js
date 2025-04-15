const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "submitted", "accepted", "rejected"],
    default: "pending",
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
  },
  feedback: String,
  finalized: {
    type: Boolean,
    default: false,
  },
});

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [{ filename: String, link: String }],
    dueDatetime: { type: Date },
    points: { type: Number },
    submissions: [SubmissionSchema],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    course: { type: String, required: true },
    semester: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);