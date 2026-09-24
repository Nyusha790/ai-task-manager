const pool = require('../config/db');

const ALLOWED_STATUSES = ['new', 'in_progress', 'done'];

function parseTaskId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

async function getTasks(_req, res) {
  const result = await pool.query(
    `SELECT id, title, description, status, created_at
     FROM tasks
     ORDER BY created_at DESC, id DESC`,
  );

  res.json(result.rows);
}

async function createTask(req, res) {
  const { title, description = '' } = req.body;

  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Название задачи обязательно' });
  }

  if (title.trim().length > 255) {
    return res.status(400).json({ error: 'Название не должно превышать 255 символов' });
  }

  if (typeof description !== 'string') {
    return res.status(400).json({ error: 'Описание должно быть строкой' });
  }

  const result = await pool.query(
    `INSERT INTO tasks (title, description)
     VALUES ($1, $2)
     RETURNING id, title, description, status, created_at`,
    [title.trim(), description.trim()],
  );

  return res.status(201).json(result.rows[0]);
}

async function updateTaskStatus(req, res) {
  const id = parseTaskId(req.params.id);
  const { status } = req.body;

  if (id === null) {
    return res.status(400).json({ error: 'Некорректный идентификатор задачи' });
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'Статус должен быть new, in_progress или done',
    });
  }

  const result = await pool.query(
    `UPDATE tasks
     SET status = $1
     WHERE id = $2
     RETURNING id, title, description, status, created_at`,
    [status, id],
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  return res.json(result.rows[0]);
}

async function deleteTask(req, res) {
  const id = parseTaskId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: 'Некорректный идентификатор задачи' });
  }

  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 RETURNING id',
    [id],
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  return res.status(204).send();
}

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
};
