const mongoose = require('mongoose');

// Each stage in the roadmap is an ordered group of resources
const stageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  order: { type: Number, default: 0 },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
});

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    coverImage: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
      default: 'all-levels',
    },
    stages: [stageSchema],
    estimatedTime: {
      type: String, // e.g. "3-6 months"
    },
    tags: [{ type: String, trim: true }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

roadmapSchema.pre('validate', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
