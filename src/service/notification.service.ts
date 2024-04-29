import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { nodemailerTransport } from "../app";
import { FilterQuery, ObtainDocumentType } from "mongoose";
import notificationModel, { NotificationDocument } from "../model/notification.model";

export const sendOTP = async (phone: string, otp: string) => {
    // Create an SNSClient instance using environment variables for configuration
    const snsClient = new SNSClient({
        region: process.env.AWS_REGION as string,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
        }
    });

    // Setting up the parameters for the PublishCommand
    const params = {
        Message: `Your OTP is ${otp}`,
        PhoneNumber: phone,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': { // Custom sender ID
                DataType: 'String',
                StringValue: 'OTPService'
            },
            'AWS.SNS.SMS.SMSType': { // Type of SMS
                DataType: 'String',
                StringValue: 'Transactional'
            }
        }
    };

    // Try to send the SMS and catch any errors
    try {
        const command = new PublishCommand(params);
        const response = await snsClient.send(command);
        
        return response;
    } catch (err) {
        console.error(err);
        throw err; // Re-throw the error to handle it in the calling function if needed
    }
}

// Function to send verification email
export const sendVerificationEmail = async (recipientName: string, recipientEmail: string, otp: string) => {
    const mailOptions = {
        from: {
            name: 'carCheck',
            address: process.env.EMAIL_USER as string
        },
        to: recipientEmail,
        subject: 'Selling Account Verification',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <h2 style="color: #3498db; margin-bottom: 10px;">Welcome to ${process.env.APP_NAME}!</h2>
                <p>Hello ${recipientName},</p>
                <p>Please verify your account by using the security code below:</p>
                <h3 style="color: #3498db; margin-top: 10px;">${otp}</h3>
                <p style="margin-top: 20px;">This code will expires in 20 minutes.</p>
                <p style="margin-top: 10px; color: #888;">If you did not request this, please ignore this email.</p>
            </div>
        `,
    };
    await nodemailerTransport.sendMail(mailOptions);
};

// Function to send password reset email
export const sendPasswordResetEmail = async (recipientEmail: string, resetUrl: string) => {
    const mailOptions = {
        from: {
            name: process.env.APP_NAME as string,
            address: process.env.EMAIL_USER as string
        },
        to: recipientEmail,
        subject: 'Password Reset',
        text: `Please reset your password by clicking this link: ${resetUrl}`,
    };

    await nodemailerTransport.sendMail(mailOptions);
};

export const createNotification = async (input: ObtainDocumentType<Omit<NotificationDocument, 'createdAt' | 'updatedAt'>>) => {
    try {
        const notification = await notificationModel.create(input);
        return notification;
    } catch (err: any) {
        throw new Error(err);
    }
}

export const filterNotifications = async (query: FilterQuery<NotificationDocument>) => {
    try {
        return await notificationModel.find(query).lean()
    } catch (err: any) {
        throw new Error(err);
    }
}

export const updateNotification = async (query: FilterQuery<NotificationDocument>, update: Partial<NotificationDocument>) => {
    try {
        return await notificationModel.findOneAndUpdate(query, update, { new: true }).lean();
    }
    catch (err: any) {
        throw new Error(err);
    }
}

export const updateNotifications = async (query: FilterQuery<NotificationDocument>, update: Partial<NotificationDocument>) => {
    try {
        return await notificationModel.updateMany(query, update, { new: true }).lean();
    }
    catch (err: any) {
        throw new Error(err);
    }
}