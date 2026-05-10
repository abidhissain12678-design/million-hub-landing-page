// Local storage utilities for offline development
export const localStorageKeys = {
  TASKS: 'millionhub_tasks',
  USER: 'millionhub_user'
};

export const saveTasksToLocal = (tasks: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(localStorageKeys.TASKS, JSON.stringify(tasks));
  }
};

export const loadTasksFromLocal = (): any[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(localStorageKeys.TASKS);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const addTaskToLocal = (task: any) => {
  const tasks = loadTasksFromLocal();
  const newTask = { ...task, id: Date.now().toString() };
  tasks.push(newTask);
  saveTasksToLocal(tasks);
  return newTask;
};

export const deleteTaskFromLocal = (id: string) => {
  const tasks = loadTasksFromLocal();
  const filtered = tasks.filter(t => t.id !== id);
  saveTasksToLocal(filtered);
};