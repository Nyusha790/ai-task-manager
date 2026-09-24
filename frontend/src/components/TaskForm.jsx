import { useState } from 'react';

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function TaskForm({ onCreate, isCreating }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const created = await onCreate({
      title: title.trim(),
      description: description.trim(),
    });

    if (created) {
      setTitle('');
      setDescription('');
    }
  }

  return (
    <section className="panel create-panel" aria-labelledby="create-task-title">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Новая задача</span>
          <h2 id="create-task-title">Добавьте задачу в план</h2>
        </div>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <label className="field field-title">
          <span>Название</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например, изучить основы React"
            maxLength={255}
            disabled={isCreating}
            required
          />
          <small>{title.length}/255</small>
        </label>

        <label className="field field-description">
          <span>Описание</span>
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Добавьте детали, чтобы ничего не забыть"
            maxLength={1000}
            disabled={isCreating}
          />
        </label>

        <button
          className="primary-button"
          type="submit"
          disabled={isCreating || !title.trim()}
        >
          <PlusIcon />
          {isCreating ? 'Добавляем…' : 'Добавить задачу'}
        </button>
      </form>
    </section>
  );
}