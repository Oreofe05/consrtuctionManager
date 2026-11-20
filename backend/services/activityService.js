import ActivityLog from "../models/ActivityLog.js";
import Notification from "../models/Notification.js";

export async function logActivity({ actor, project, action, entityType, entityId, details, notifyUsers = [] }) {
  await ActivityLog.create({ actor, project, action, entityType, entityId, details });
  if (notifyUsers.length) {
    await Notification.insertMany(notifyUsers.map(user => ({
      user, title: action, message: details || action, type: "info",
      link: project ? `/projects/${project}` : undefined
    })));
  }
}
