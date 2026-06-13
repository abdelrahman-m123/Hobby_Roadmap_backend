const mongoose = require('mongoose');

/*
  JSON import format for flashcard sets:
  {
    "title": "Guitar Chords",
    "description": "Common open chords for beginners",
    "cards": [
      {
        "front": "G Major chord",
        "back": "Fingers on frets: index 2nd fret 5th string, middle 3rd fret 6th string, ring 3rd fret 1st string"
      }
    ]
  }
*/

const cardSchema = new mongoose.Schema({
  front: { type: String, required: true, trim: true },
  back: { type: String, required: true, trim: true },
  hint: { type: String, trim: true }, // optional hint shown before revealing
});

const flashcardSetSchema = new mongoose.Schema(
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
    cards: {
      type: [cardSchema],
      validate: {
        validator: (v) => v.length >= 1,
        message: 'A flashcard set must have at least one card.',
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FlashcardSet', flashcardSetSchema);
