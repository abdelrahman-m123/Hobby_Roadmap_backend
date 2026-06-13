const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ['youtube', 'pdf'],
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    // For YouTube: extracted video ID for embedding
    youtubeId: {
      type: String,
    },
    // Rough duration or page count — optional metadata
    duration: {
      type: String, // e.g. "14:32" for videos
    },
    // Which step in the roadmap this resource belongs to
    roadmap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
    },
    // Ordered position within its roadmap step
    order: {
      type: Number,
      default: 0,
    },
    // The roadmap step/stage label this belongs to
    stage: {
      type: String,
      trim: true, // e.g. "Beginner", "Intermediate", "Advanced"
    },
    tags: [{ type: String, trim: true }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-extract YouTube ID from URL
resourceSchema.pre('save', function (next) {
  if (this.type === 'youtube' && this.url) {
    const match = this.url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (match) this.youtubeId = match[1];
  }
  next();
});

module.exports = mongoose.model('Resource', resourceSchema);
