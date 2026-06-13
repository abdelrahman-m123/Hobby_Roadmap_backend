const mongoose = require('mongoose');

/*
  JSON import format for quizzes:
  {
    "title": "Photography Basics Quiz",
    "description": "Test your knowledge of camera fundamentals",
    "questions": [
      {
        "question": "What does ISO control?",
        "options": ["Aperture", "Shutter speed", "Sensor sensitivity", "Focus"],
        "correctOption": 2,
        "explanation": "ISO controls the sensor's sensitivity to light."
      }
    ]
  }
*/

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  options: {
    type: [String],
    validate: {
      validator: (v) => v.length >= 2 && v.length <= 6,
      message: 'A question must have between 2 and 6 options.',
    },
    required: true,
  },
  correctOption: {
    type: Number,
    required: true, // 0-based index into options array
  },
  explanation: {
    type: String,
    trim: true, // shown after answering
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    roadmap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (v) => v.length >= 1,
        message: 'A quiz must have at least one question.',
      },
    },
    passingScore: {
      type: Number,
      default: 70, // percentage
      min: 0,
      max: 100,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
