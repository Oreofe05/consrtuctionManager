
const STORAGE_KEY = "construction_pmis_resources";

export function getResources() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Unable to load resources:", error);
    return [];
  }
}

export function saveResources(resources) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
}

export function addResource(resource) {
  const newResource = {
    ...resource,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  saveResources([newResource, ...getResources()]);
  return newResource;
}

export function updateResource(id, changes) {
  const updated = getResources().map((resource) =>
    resource.id === id ? { ...resource, ...changes } : resource
  );

  saveResources(updated);
  return updated;
}

export function deleteResource(id) {
  const updated = getResources().filter(
    (resource) => resource.id !== id
  );

  saveResources(updated);
  return updated;
}

