const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/taskController');

router.get('/', auth, ctrl.getTasks);
router.post('/', auth, ctrl.createTask);
router.get('/:id', auth, ctrl.getTask);
router.put('/:id', auth, ctrl.updateTask);
router.delete('/:id', auth, ctrl.deleteTask);

module.exports = router;
