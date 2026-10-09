
const STORAGE_KEY = "construction_pmis_settings";

export const defaultSettings = {
  organizationName: "University of Ibadan",
  systemName: "BuildControl",
  department: "Directorate of Physical Planning and Project Management",
  contactEmail: "",
  currency: "NGN",
  dateFormat: "DD/MM/YYYY",
  notifications: {
    projectUpdates: true,
    taskDeadlines: true,
    budgetAlerts: true,
    progressReports: false,
  },
  preferences: {
    compactTable: false,
    showWelcomeMessage: true,
  },
};

export function getSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return structuredClone(defaultSettings);
    }

    const parsed = JSON.parse(saved);

    return {
      ...structuredClone(defaultSettings),
      ...parsed,
      notifications: {
        ...defaultSettings.notifications,
        ...(parsed.notifications || {}),
      },
      preferences: {
        ...defaultSettings.preferences,
        ...(parsed.preferences || {}),
      },
    };
  } catch (error) {
    console.error("Unable to load settings:", error);
    return structuredClone(defaultSettings);
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  return settings;
}

export function resetSettings() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(defaultSettings);
}

