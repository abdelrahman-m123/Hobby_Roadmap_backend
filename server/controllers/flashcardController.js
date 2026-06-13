const FlashcardSet = require('../models/FlashcardSet');

// GET /api/flashcards?resource=:resourceId
exports.getByResource = async (req, res) => {
  try {
    const resourceId = req.query.resource || req.query.resourceId;
    const roadmapId = req.query.roadmap || req.query.roadmapId;
    const filter = {};
    if (resourceId) filter.resource = resourceId;
    if (roadmapId) filter.roadmap = roadmapId;
    const sets = await FlashcardSet.find(filter).populate('createdBy', 'username');
    res.json({ flashcardSets: sets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/flashcards/:id
exports.getOne = async (req, res) => {
  try {
    const set = await FlashcardSet.findById(req.params.id).populate('createdBy', 'username');
    if (!set) return res.status(404).json({ message: 'Flashcard set not found.' });
    res.json({ flashcardSet: set });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/flashcards  [admin] — manual creation
exports.create = async (req, res) => {
  try {
    const { title, description, resource, roadmap, cards } = req.body;
    const set = await FlashcardSet.create({
      title,
      description,
      resource,
      roadmap,
      cards,
      createdBy: req.user._id,
    });
    res.status(201).json({ flashcardSet: set });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/flashcards/import  [admin] — create from JSON
/*
  Expected body:
  {
    "resource": "<resourceId>",
    "roadmap": "<roadmapId>",
    "json": {
      "title": "Guitar Chords",
      "description": "Common open chords for beginners",
      "cards": [
        { "front": "G Major", "back": "Description...", "hint": "optional" }
      ]
    }
  }
*/
exports.importFromJson = async (req, res) => {
  try {
    const { resource, roadmap, json } = req.body;

    if (!json || !json.title || !Array.isArray(json.cards)) {
      return res.status(400).json({ message: 'Invalid JSON format. Required: title, cards[].' });
    }

    const set = await FlashcardSet.create({
      title: json.title,
      description: json.description,
      resource,
      roadmap,
      cards: json.cards,
      createdBy: req.user._id,
    });

    res.status(201).json({ flashcardSet: set });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/flashcards/:id  [admin]
exports.update = async (req, res) => {
  try {
    const allowed = ['title', 'description', 'cards'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const set = await FlashcardSet.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!set) return res.status(404).json({ message: 'Flashcard set not found.' });
    res.json({ flashcardSet: set });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/flashcards/:id  [admin]
exports.remove = async (req, res) => {
  try {
    const set = await FlashcardSet.findByIdAndDelete(req.params.id);
    if (!set) return res.status(404).json({ message: 'Flashcard set not found.' });
    res.json({ message: 'Flashcard set deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
