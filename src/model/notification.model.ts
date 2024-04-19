import mongoose from "mongoose";


export enum NotificationType {
   SYSTEM = 'system',
    ACTIVITY = 'activity',
    TRANSACTION = 'transaction'
}

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: Object.values(NotificationType),
        default:    NotificationType.ACTIVITY
    },
    link: {
        type: String,
        required: false
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export interface NotificationDocument extends mongoose.Document {
    user: NotificationDocument['_id'];
    title: string;
    message: string;
    isActive: boolean;
    type: NotificationType;
    link: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;