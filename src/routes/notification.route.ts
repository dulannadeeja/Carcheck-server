import { Express } from 'express';
import requireUser from '../middleware/requireUser';
import { getNotificationsOfUser, markAllAsRead } from '../controller/notification.controller';

function notificationRoutes(app: Express) {
    app.get('/api/notifications', requireUser, getNotificationsOfUser);
    app.put('/api/notifications/read', requireUser, markAllAsRead);
  }

export default notificationRoutes;