const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Не удалось выполнить запрос');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getTasks() {
  return request('/tasks');
}

export function createTask(data) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTaskStatus(id, status) {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
}