const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/roadmapController');
const { protect, optionalAuth, restrictTo } = require('../middleware/auth');

router.get('/', optionalAuth, ctrl.getAll);
router.get('/admin/all', protect, restrictTo('admin'), ctrl.getAllAdmin);
router.get('/:slug', optionalAuth, ctrl.getOne);
router.post('/', protect, restrictTo('admin'), ctrl.create);
router.patch('/:id', protect, restrictTo('admin'), ctrl.update);
router.delete('/:id', protect, restrictTo('admin'), ctrl.remove);
router.post('/:id/save', protect, ctrl.toggleSave);
router.get('/:id/progress', protect, ctrl.getProgress);
router.patch('/:id/progress', protect, ctrl.updateProgress);

module.exports = router;
