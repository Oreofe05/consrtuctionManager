
const STORAGE_KEY = "buildcontrol_notifications";

const defaultNotifications = [
  {
    id: "NOT-001",
    title: "Project deadline approaching",
    message:
      "The electrical installation inspection for Faculty of Engineering Renovation is approaching its deadline.",
    type: "deadline",
    priority: "high",
    projectCode: "UI-ENG-001",
    createdAt: "2026-10-09T08:30:00",
    targetRoles: ["System Administrator", "Project Manager", "Site Engineer"],
    readBy: [],
    deletedBy: [],
  },
  {
    id: "NOT-002",
    title: "Budget review required",
    message:
      "Review expenditure records for Student Accommodation Block C and confirm the remaining project budget.",
    type: "budget",
    priority: "high",
    projectCode: "UI-HOS-002",
    createdAt: "2026-10-09T07:45:00",
    targetRoles: ["System Administrator", "Project Manager", "Finance Officer"],
    readBy: [],
    deletedBy: [],
  },
  {
    id: "NOT-003",
    title: "Project progress updated",
    message:
      "The progress record for Faculty of Engineering Renovation has been updated to 78%.",
    type: "progress",
    priority: "normal",
    projectCode: "UI-ENG-001",
    createdAt: "2026-10-08T15:20:00",
    targetRoles: ["System Administrator", "Project Manager", "Site Engineer"],
    readBy: [],
    deletedBy: [],
  },
  {
    id: "NOT-004",
    title: "Task requires attention",
    message:
      "The concrete quality assessment for Student Accommodation Block C needs to be reviewed.",
    type: "task",
    priority: "normal",
    projectCode: "UI-HOS-002",
    createdAt: "2026-10-08T11:10:00",
    targetRoles: ["System Administrator", "Project Manager", "Site Engineer"],
    readBy: [],
    deletedBy: [],
  },
  {
    id: "NOT-005",
    title: "Expenditure record added",
    message:
      "A new expenditure entry has been recorded for a construction project. Verify the supporting documentation.",
    type: "budget",
    priority: "normal",
    projectCode: "UI-SCI-004",
    createdAt: "2026-10-07T09:00:00",
    targetRoles: ["System Administrator", "Finance Officer"],
    readBy: [],
    deletedBy: [],
  },
  {
    id: "NOT-006",
    title: "Weekly progress report due",
    message:
      "Prepare and review the weekly field progress report for active construction projects.",
    type: "report",
    priority: "normal",
    projectCode: null,
    createdAt: "2026-10-06T08:00:00",
    targetRoles: ["System Administrator", "Project Manager", "Site Engineer"],
    readBy: [],
    deletedBy: [],
  },
];

function readStoredNotifications() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      return JSON.parse(stored);
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultNotifications)
    );

    return defaultNotifications;
  } catch (error) {
    console.error("Could not load notifications:", error);
    return defaultNotifications;
  }
}

function writeStoredNotifications(notifications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

function getUserKey(user) {
  return user?.email || user?.name || "guest";
}

export function getNotificationsForUser(user) {
  const userKey = getUserKey(user);
  const role = user?.role;

  return readStoredNotifications()
    .filter((notification) => {
      const canView =
        !notification.targetRoles ||
        notification.targetRoles.length === 0 ||
        notification.targetRoles.includes(role);

      const deleted = (notification.deletedBy || []).includes(userKey);

      return canView && !deleted;
    })
    .map((notification) => ({
      ...notification,
      isRead: (notification.readBy || []).includes(userKey),
    }))
    .sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
}

export function markNotificationAsRead(notificationId, user) {
  const userKey = getUserKey(user);

  const updated = readStoredNotifications().map((notification) => {
    if (notification.id !== notificationId) {
      return notification;
    }

    const readBy = notification.readBy || [];

    return {
      ...notification,
      readBy: readBy.includes(userKey)
        ? readBy
        : [...readBy, userKey],
    };
  });

  writeStoredNotifications(updated);
}

export function markAllNotificationsAsRead(user) {
  const userKey = getUserKey(user);
  const role = user?.role;

  const updated = readStoredNotifications().map((notification) => {
    const canView =
      !notification.targetRoles ||
      notification.targetRoles.length === 0 ||
      notification.targetRoles.includes(role);

    if (!canView) {
      return notification;
    }

    const readBy = notification.readBy || [];

    return {
      ...notification,
      readBy: readBy.includes(userKey)
        ? readBy
        : [...readBy, userKey],
    };
  });

  writeStoredNotifications(updated);
}

export function deleteNotification(notificationId, user) {
  const userKey = getUserKey(user);

  const updated = readStoredNotifications().map((notification) => {
    if (notification.id !== notificationId) {
      return notification;
    }

    const deletedBy = notification.deletedBy || [];

    return {
      ...notification,
      deletedBy: deletedBy.includes(userKey)
        ? deletedBy
        : [...deletedBy, userKey],
    };
  });

  writeStoredNotifications(updated);
}

export function addNotification(notification) {
  const notifications = readStoredNotifications();

  const newNotification = {
    id: `NOT-${Date.now()}`,
    title: notification.title || "New notification",
    message: notification.message || "",
    type: notification.type || "general",
    priority: notification.priority || "normal",
    projectCode: notification.projectCode || null,
    createdAt: new Date().toISOString(),
    targetRoles: notification.targetRoles || [],
    readBy: [],
    deletedBy: [],
  };

  writeStoredNotifications([newNotification, ...notifications]);

  return newNotification;
}