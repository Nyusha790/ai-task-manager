const express = require('express');
const {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(getTasks));
router.post('/', asyncHandler(createTask));
router.put('/:id', asyncHandler(updateTaskStatus));
router.delete('/:id', asyncHandler(deleteTask));

module.exports = router;