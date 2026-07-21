const Roadmap = require('../models/Roadmap');
const User = require('../models/User');

// GET /api/roadmaps  — public, supports ?category=&search=&difficulty=
exports.getAll = async (req, res) => {
  try {
    const filter = { isPublished: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const roadmaps = await Roadmap.find(filter)
      .populate('category', 'name slug icon')
      .populate('createdBy', 'username')
      .select('-stages')
      .sort('-createdAt');

    res.json({ roadmaps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/roadmaps/all  [admin] — includes unpublished
exports.getAllAdmin = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find()
      .populate('category', 'name slug')
      .populate('createdBy', 'username')
      .sort('-createdAt');
    res.json({ roadmaps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/roadmaps/:slug
exports.getOne = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ slug: req.params.slug })
      .populate('category', 'name slug icon')
      .populate('createdBy', 'username')
      .populate('stages.resources');

    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });

    // Non-admins can only see published roadmaps
    if (!roadmap.isPublished && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'This roadmap is not published yet.' });
    }

    res.json({ roadmap });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/roadmaps  [admin]
exports.create = async (req, res) => {
  try {
    const { title, slug, description, category, coverImage, difficulty, estimatedTime, tags, stages, isPublished } = req.body;
    const roadmap = await Roadmap.create({
      title,
      slug,
      description,
      category,
      coverImage,
      difficulty,
      estimatedTime,
      tags,
      stages: stages || [],
      createdBy: req.user._id,
      isPublished
    });
    res.status(201).json({ roadmap });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Roadmap slug already exists.' });
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/roadmaps/:id  [admin]
exports.update = async (req, res) => {
  try {
    const allowed = ['title', 'slug', 'description', 'category', 'coverImage', 'difficulty',
                     'estimatedTime', 'tags', 'stages', 'isPublished'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const roadmap = await Roadmap.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });
    res.json({ roadmap });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/roadmaps/:id  [admin]
exports.remove = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndDelete(req.params.id);
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });
    res.json({ message: 'Roadmap deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/roadmaps/:id/save  [user] — save/unsave roadmap
exports.toggleSave = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const roadmapId = req.params.id;
    const idx = user.savedRoadmaps.indexOf(roadmapId);

    if (idx === -1) {
      user.savedRoadmaps.push(roadmapId);
      await Roadmap.findByIdAndUpdate(roadmapId, { $inc: { enrolledCount: 1 } });
    } else {
      user.savedRoadmaps.splice(idx, 1);
      await Roadmap.findByIdAndUpdate(roadmapId, { $inc: { enrolledCount: -1 } });
    }

    await user.save();
    const saved = idx === -1;
    res.json({ saved, message: saved ? 'Roadmap saved.' : 'Roadmap unsaved.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/roadmaps/:id/progress  [user] — mark a resource complete/incomplete
exports.updateProgress = async (req, res) => {
  try {
    const { resourceId, completed } = req.body;
    const user = await User.findById(req.user._id);
    const roadmapId = req.params.id;

    let entry = user.progress.find((p) => p.roadmap.toString() === roadmapId);
    if (!entry) {
      user.progress.push({ roadmap: roadmapId, completedResources: [] });
      entry = user.progress[user.progress.length - 1];
    }

    const resIdx = entry.completedResources.indexOf(resourceId);
    if (completed && resIdx === -1) {
      entry.completedResources.push(resourceId);
    } else if (!completed && resIdx !== -1) {
      entry.completedResources.splice(resIdx, 1);
    }

    await user.save();
    res.json({ progress: entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/roadmaps/:id/progress  [user]
exports.getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const entry = user.progress.find((p) => p.roadmap.toString() === req.params.id);
    res.json({ progress: entry || { roadmap: req.params.id, completedResources: [] } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
