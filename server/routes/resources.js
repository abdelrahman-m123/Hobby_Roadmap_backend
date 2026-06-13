const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/resourceController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', ctrl.getByRoadmap);
router.get('/:id', ctrl.getOne);
router.post('/', protect, restrictTo('admin'), ctrl.create);
router.patch('/:id', protect, restrictTo('admin'), ctrl.update);
router.delete('/:id', protect, restrictTo('admin'), ctrl.remove);

module.exports = router;
