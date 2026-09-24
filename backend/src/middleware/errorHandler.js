function notFoundHandler(req, res) {
  res.status(404).json({
    error: `Маршрут ${req.method} ${req.originalUrl} не найден`,
  });
}

function errorHandler(error, _req, res, _next) {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON' });
  }

  if (['23502', '23514', '22001'].includes(error.code)) {
    return res.status(400).json({ error: 'Переданы некорректные данные' });
  }

  console.error(error);

  return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};