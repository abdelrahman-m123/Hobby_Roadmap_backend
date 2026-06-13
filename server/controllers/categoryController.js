const Category = require('../models/Category');

// GET /api/categories
exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find().populate('createdBy', 'username').sort('name');
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/categories/:slug
exports.getOne = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate('createdBy', 'username');
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/categories  [admin]
exports.create = async (req, res) => {
  try {
    const { name, description, icon, slug } = req.body;
    const category = await Category.create({
      name,
      description,
      icon,
      slug,
      createdBy: req.user._id,
    });
    res.status(201).json({ category });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Category name or slug already exists.' });
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/categories/:id  [admin]
exports.update = async (req, res) => {
  try {
    const allowed = ['name', 'description', 'icon', 'slug'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/categories/:id  [admin]
exports.remove = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
