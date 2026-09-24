const STATUS_LABELS = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Готово',
};

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
    </svg>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">✓</div>
      <h3>Список пока пуст</h3>
      <p>Создайте первую задачу — она появится здесь.</p>
    </div>
  );
}

export default function TaskTable({
  tasks,
  isLoading,
  busyTaskId,
  onStatusChange,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="loading-state" role="status">
        <span className="spinner" />
        Загружаем задачи…
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Задача</th>
            <th>Создана</th>
            <th>Статус</th>
            <th><span className="sr-only">Действия</span></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isBusy = busyTaskId === task.id;

            return (
              <tr key={task.id} className={isBusy ? 'is-busy' : ''}>
                <td data-label="Задача">
                  <div className="task-copy">
                    <strong>{task.title}</strong>
                    <p>{task.description || 'Без описания'}</p>
                  </div>
                </td>
                <td data-label="Создана" className="date-cell">
                  {formatDate(task.created_at)}
                </td>
                <td data-label="Статус">
                  <select
                    className={`status-select status-${task.status}`}
                    value={task.status}
                    onChange={(event) => onStatusChange(task.id, event.target.value)}
                    disabled={isBusy}
                    aria-label={`Статус задачи ${task.title}`}
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
                <td data-label="Действия" className="actions-cell">
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => onDelete(task.id)}
                    disabled={isBusy}
                    aria-label={`Удалить задачу ${task.title}`}
                    title="Удалить задачу"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}