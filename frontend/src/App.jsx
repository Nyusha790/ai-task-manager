import { useCallback, useEffect, useMemo, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTaskStatus,
} from './api/tasks';

function StatCard({ label, value, tone }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <span className="stat-dot" />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState(null);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      setTasks(await getTasks());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const stats = useMemo(() => ({
    total: tasks.length,
    new: tasks.filter((task) => task.status === 'new').length,
    inProgress: tasks.filter((task) => task.status === 'in_progress').length,
    done: tasks.filter((task) => task.status === 'done').length,
  }), [tasks]);

  async function handleCreate(data) {
    setIsCreating(true);
    setError('');

    try {
      const task = await createTask(data);
      setTasks((currentTasks) => [task, ...currentTasks]);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsCreating(false);
    }
  }

  async function handleStatusChange(id, status) {
    setBusyTaskId(id);
    setError('');

    try {
      const updatedTask = await updateTaskStatus(id, status);
      setTasks((currentTasks) => currentTasks.map((task) => (
        task.id === id ? updatedTask : task
      )));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handleDelete(id) {
    setBusyTaskId(id);
    setError('');

    try {
      await deleteTask(id);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyTaskId(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AI Task Manager — наверх">
          <span>AI Task Manager</span>
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="stats-grid" aria-label="Статистика задач">
            <StatCard label="Всего" value={stats.total} tone="total" />
            <StatCard label="Новые" value={stats.new} tone="new" />
            <StatCard label="В работе" value={stats.inProgress} tone="progress" />
            <StatCard label="Готово" value={stats.done} tone="done" />
          </div>
        </section>

        {error && (
          <div className="error-banner" role="alert">
            <strong>Не удалось выполнить действие.</strong>
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} aria-label="Закрыть сообщение">×</button>
          </div>
        )}

        <TaskForm onCreate={handleCreate} isCreating={isCreating} />

        <section className="panel tasks-panel" aria-labelledby="task-list-title">
          <div className="panel-heading list-heading">
            <div>
              <span className="eyebrow">Ваш план</span>
              <h2 id="task-list-title">Список задач</h2>
            </div>
            <button className="refresh-button" type="button" onClick={loadTasks} disabled={isLoading}>
              Обновить
            </button>
          </div>

          <TaskTable
            tasks={tasks}
            isLoading={isLoading}
            busyTaskId={busyTaskId}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}