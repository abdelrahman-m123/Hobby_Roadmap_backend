const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.get('/:slug', ctrl.getOne);
router.post('/', protect, restrictTo('admin'), ctrl.create);
router.patch('/:id', protect, restrictTo('admin'), ctrl.update);
router.delete('/:id', protect, restrictTo('admin'), ctrl.remove);

module.exports = router;
