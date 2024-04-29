import { NextFunction, Response, Request } from "express";
import { filterNotifications, updateNotification, updateNotifications } from "../service/notification.service";
import { sendErrorToErrorHandlingMiddleware } from "../utils/errorHandling";

export const getNotificationsOfUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user._id;

    try {
        const notifications = await filterNotifications({
            user: userId
        });
        return res.send(notifications);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user._id;

    try {
        const notification = await updateNotifications({
            user: userId
        }, {
            read: true
        });
        return res.send(notification);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}