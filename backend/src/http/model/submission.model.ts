import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  questionId: String,
  language: String,
  code: String,
  verdict: String,
  executionTime: Number,
  memory: Number,
  createdAt: { type: Date, default: Date.now }
});

export const Submission = mongoose.model(
  "Submission",
  SubmissionSchema
);
