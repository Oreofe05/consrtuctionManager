
const STORAGE_KEY = "construction_pmis_progress";

export function getProgressUpdates() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Unable to load progress updates:", error);
    return [];
  }
}

export function saveProgressUpdates(updates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updates));
}

export function addProgressUpdate(update) {
  const newUpdate = {
    ...update,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  saveProgressUpdates([newUpdate, ...getProgressUpdates()]);
  return newUpdate;
}

export function deleteProgressUpdate(id) {
  const updated = getProgressUpdates().filter(
    (update) => update.id !== id
  );

  saveProgressUpdates(updated);
  return updated;
}