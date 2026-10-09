
const STORAGE_KEY = "construction_pmis_expenditures";

export function getExpenditures() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Unable to load expenditures:", error);
    return [];
  }
}

export function saveExpenditures(expenditures) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenditures));
}

export function addExpenditure(expenditure) {
  const newExpenditure = {
    ...expenditure,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  saveExpenditures([newExpenditure, ...getExpenditures()]);
  return newExpenditure;
}

export function updateExpenditure(id, changes) {
  const updated = getExpenditures().map((expenditure) =>
    expenditure.id === id
      ? { ...expenditure, ...changes }
      : expenditure
  );

  saveExpenditures(updated);
  return updated;
}

export function deleteExpenditure(id) {
  const updated = getExpenditures().filter(
    (expenditure) => expenditure.id !== id
  );

  saveExpenditures(updated);
  return updated;
}