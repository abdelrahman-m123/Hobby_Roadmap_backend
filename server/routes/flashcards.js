const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/flashcardController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', ctrl.getByResource);
router.get('/:id', ctrl.getOne);
router.post('/', protect, restrictTo('admin'), ctrl.create);
router.post('/import', protect, restrictTo('admin'), ctrl.importFromJson);
router.patch('/:id', protect, restrictTo('admin'), ctrl.update);
router.delete('/:id', protect, restrictTo('admin'), ctrl.remove);

module.exports = router;
