const Resource = require('../models/Resource');
const Roadmap = require('../models/Roadmap');

// GET /api/resources?roadmap=:roadmapId
exports.getByRoadmap = async (req, res) => {
  try {
    const roadmapId = req.query.roadmap || req.query.roadmapId;
    if (!roadmapId) {
      return res.status(400).json({ message: 'roadmap query param is required.' });
    }
    const resources = await Resource.find({ roadmap: roadmapId })
      .populate('createdBy', 'username')
      .sort('order');
    res.json({ resources });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resources/:id
exports.getOne = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('createdBy', 'username');
    if (!resource) return res.status(404).json({ message: 'Resource not found.' });
    res.json({ resource });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/resources  [admin]
exports.create = async (req, res) => {
  try {
    const { title, description, type, url, duration, roadmap, order, stage, tags } = req.body;

    const resource = await Resource.create({
      title,
      description,
      type,
      url,
      duration,
      roadmap,
      order,
      stage,
      tags,
      createdBy: req.user._id,
    });

    // Also push into the matching stage in the Roadmap document
    if (stage) {
      await Roadmap.findOneAndUpdate(
        { _id: roadmap, 'stages.title': stage },
        { $push: { 'stages.$.resources': resource._id } }
      );
    }

    res.status(201).json({ resource });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/resources/:id  [admin]
exports.update = async (req, res) => {
  try {
    const allowed = ['title', 'description', 'type', 'url', 'duration', 'order', 'stage', 'tags'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const resource = await Resource.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!resource) return res.status(404).json({ message: 'Resource not found.' });
    res.json({ resource });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/resources/:id  [admin]
exports.remove = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found.' });

    // Remove from roadmap stage
    await Roadmap.updateMany(
      { 'stages.resources': resource._id },
      { $pull: { 'stages.$[].resources': resource._id } }
    );

    res.json({ message: 'Resource deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
