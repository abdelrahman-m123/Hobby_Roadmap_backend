const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// GET /api/quizzes?resource=:resourceId
exports.getByResource = async (req, res) => {
  try {
    const resourceId = req.query.resource || req.query.resourceId;
    const roadmapId = req.query.roadmap || req.query.roadmapId;
    const filter = {};
    if (resourceId) filter.resource = resourceId;
    if (roadmapId) filter.roadmap = roadmapId;
    const quizzes = await Quiz.find(filter).populate('createdBy', 'username');
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/quizzes/:id
exports.getOne = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'username');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });
    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/quizzes  [admin] — manual creation
exports.create = async (req, res) => {
  try {
    const { title, description, resource, roadmap, questions, passingScore } = req.body;
    const quiz = await Quiz.create({
      title,
      description,
      resource,
      roadmap,
      questions,
      passingScore,
      createdBy: req.user._id,
    });
    res.status(201).json({ quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/quizzes/import  [admin] — create from JSON
/*
  Expected body:
  {
    "resource": "<resourceId>",
    "roadmap": "<roadmapId>",
    "passingScore": 70,          // optional, defaults to 70
    "json": {
      "title": "...",
      "description": "...",
      "questions": [
        {
          "question": "...",
          "options": ["A", "B", "C", "D"],
          "correctOption": 2,
          "explanation": "..."
        }
      ]
    }
  }
*/
exports.importFromJson = async (req, res) => {
  try {
    const { resource, roadmap, passingScore, json } = req.body;

    if (!json || !json.title || !Array.isArray(json.questions)) {
      return res.status(400).json({ message: 'Invalid JSON format. Required: title, questions[].' });
    }

    const quiz = await Quiz.create({
      title: json.title,
      description: json.description,
      resource,
      roadmap,
      questions: json.questions,
      passingScore: passingScore ?? 70,
      createdBy: req.user._id,
    });

    res.status(201).json({ quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/quizzes/:id  [admin]
exports.update = async (req, res) => {
  try {
    const allowed = ['title', 'description', 'questions', 'passingScore'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });
    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/quizzes/:id  [admin]
exports.remove = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });
    res.json({ message: 'Quiz deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/quizzes/:id/submit  [user] — submit answers and record attempt
exports.submit = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

    const { answers } = req.body; // [{ questionIndex, selectedOption }]
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'answers must be an array.' });
    }

    const gradedAnswers = answers.map(({ questionIndex, selectedOption }) => {
      const q = quiz.questions[questionIndex];
      return {
        questionIndex,
        selectedOption,
        isCorrect: q ? selectedOption === q.correctOption : false,
      };
    });

    const correct = gradedAnswers.filter((a) => a.isCorrect).length;
    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quiz._id,
      answers: gradedAnswers,
      score,
      passed,
    });

    res.json({ attempt, score, passed, correct, total: quiz.questions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/quizzes/:id/attempts  [user] — own attempts
exports.getAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      quiz: req.params.id,
      user: req.user._id,
    }).sort('-completedAt');
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
