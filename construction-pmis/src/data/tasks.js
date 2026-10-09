const STORAGE_KEY = "construction_pmis_tasks";

export function getTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Unable to load tasks:", error);
    return [];
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function addTask(task) {
  const newTask = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  saveTasks([newTask, ...getTasks()]);
  return newTask;
}

export function updateTask(id, changes) {
  const updatedTasks = getTasks().map((task) =>
    task.id === id ? { ...task, ...changes } : task
  );

  saveTasks(updatedTasks);
  return updatedTasks;
}

export function deleteTask(id) {
  const updatedTasks = getTasks().filter((task) => task.id !== id);
  saveTasks(updatedTasks);
  return updatedTasks;
}