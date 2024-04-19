import { NextFunction, Request, Response } from "express";
import { createUser, findUser, findUserAndUpdate, getFilteredUsers } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash"
import userModel, { UserDocs, UserDocument } from "../model/user.model";
import { AccountType, ErrorResponse } from "../types";
import { sendErrorToErrorHandlingMiddleware } from "../utils/errorHandling";
import { createNotification, sendOTP, sendVerificationEmail, updateNotification } from "../service/notification.service";
import { saveOTP, validateOTP } from "../service/verification.service";
import { ObtainDocumentType } from "mongoose";
import { VerificationDocument, VerificationType } from "../model/verification.model";
import { add } from "date-fns";
import _ = require("lodash");
import { NotificationType } from "../model/notification.model";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput["body"]>, res: Response, next: NextFunction) {
    try {
        // check if the user with the same email already exists
        // if so, return a 409 error
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            const error: ErrorResponse = {
                statusCode: 409,
                message: "User with same email already exists",
                name: "UserExistsError"
            }
            throw error;
        }
        const user = await createUser(req.body);
        return res.status(201).send(omit(user.toJSON(), "password"));
    }
    catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const checkUserExistsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body.emailOrUsername);
        const existingUser = await findUser({ email: req.body.emailOrUsername });
        if (!existingUser) {
            const error: ErrorResponse = {
                statusCode: 403,
                message: "User does not exist",
                name: "UserNotExistsError"
            }
            throw error;
        }
        return res.status(200).send({ message: "User exists" });
    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const sendOTPHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        const userId = user._id;

        console.log("user id"+userId);

        // genarate a random 6 digit OTP
        // const otp = Math.floor(100000 + Math.random() * 900000)
        const otp = 123456; // this is a static OTP for testing purposes, since we have limited access to AWS SNS
        const otpString = otp.toString();

        let target = req.body.target;

        if (req.body.type === VerificationType.phone) {
            target = `+94${req.body.target}`;
            // check if this phone number is already verified, if so, return an error
            const existingUser = await findUser({ phone: req.body.target });
            console.log(existingUser);
            // check the number is using by another user
            if (existingUser && existingUser._id.toString() !== userId) {
                const error: ErrorResponse = {
                    statusCode: 409,
                    message: "Phone number already in use",
                    name: "PhoneInUseError"
                }
                throw error;
            }
            await sendOTP(target, otpString);
        } else {
            // check if this email is already verified, if so, return an error
            const existingUser = await findUser({ email: target });
            console.log(existingUser);
            // check the email is using by another user
            if (existingUser && existingUser._id.toString() !== userId) {
                const error: ErrorResponse = {
                    statusCode: 409,
                    message: "Email already in use",
                    name: "EmailInUseError"
                }
                throw error;
            }
            await sendVerificationEmail(user.firstName, target, otpString);
        }

        // save the OTP in the database
        const expiresAt = add(new Date(), { minutes: 20 });
        const data: ObtainDocumentType<Omit<VerificationDocument, 'createdAt' | 'updatedAt'>> = {
            code: otp,
            target,
            expiresAt,
            user: user._id
        }
        await saveOTP(data);
        return res.status(200).send({ message: "OTP sent successfully" });

    } catch (err: any) {
        console.log(err);
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const verifyOTPHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const code = req.body.code;
        const type = req.body.type;
        let target = req.body.target;

        if (!req.body.code) {
            const error: ErrorResponse = {
                statusCode: 400,
                message: "Missing OTP, please provide OTP to verify",
                name: "MissingDataError"
            }
            throw error;
        }

        if (type === VerificationType.phone) {
            target = `+94${req.body.target}`;
        }

        const isValid = await validateOTP(target, code);
        if (!isValid) {
            const error: ErrorResponse = {
                statusCode: 403,
                message: "Invalid OTP",
                name: "InvalidOTPError"
            }
            throw error;
        }

        return res.status(200).send({ message: "OTP is verified" });

    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const createSellerHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user._id;

        // Find the existing user
        const existingUser = await findUser({ _id: userId });
        if (!existingUser) {
            throw { statusCode: 404, message: "User not found", name: "UserNotFoundError" };
        }

        // Prepare the update data
        const updateData = {
            ...req.body,
            firstName: req.body.personalInfo.firstName,
            lastName: req.body.personalInfo.lastName,
        };

        // Update the user
        const updatedUser = await findUserAndUpdate(
            { _id: userId },
            { $set: updateData }
        );

        if (!updatedUser) {
            throw { statusCode: 404, message: "Failed to update user", name: "UpdateError" };
        }

        // Exclude the password field from the output
        const outputSeller = omit(updatedUser, ['password', 'comparePassword']);

        // set the notification
        await createNotification({
            user: userId,
            title: "Selling Account Created",
            message: "We congratulate you on creating a selling account with us. You are one step behind to start selling your products.",
            type: NotificationType.ACTIVITY,
            link: "/selling"
        })

        // another notification
        await createNotification({
            user: userId,
            title: "Complete Your Profile",
            message: "Please complete your profile to start selling your products. we need some information to verify your account.",
            type: NotificationType.SYSTEM,
            link: "/seller/upload-documents"
        })

        return res.status(201).send(outputSeller);
    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const sellerDocumentsHandler = async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    // Identity document data
    const identityDoc: UserDocs = {
        docType: req.body.identityDocType as string,
        docName: req.body.identityDoc as string
    };

    // Business document data
    const businessDoc: UserDocs = {
        docType: req.body.businessDocType as string,
        docName: req.body.businessDoc as string
    };

    try {
        const updateData = {
            $push: { userDocs: { $each: [identityDoc, businessDoc] } }
        };

        const result = await findUserAndUpdate({ _id: user._id }, updateData);

        if (!result) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.status(200).send({
            message: 'Documents uploaded successfully'
        });
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
};

export const getFilteredUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    console.log(query);

    // construct the query object
    const filterQuery: any = {};

    // check if the query object has the required fields
    if (query.accountType) {
        const accountType = query.accountType as string[];
        filterQuery.accountType = { $in: accountType };
    }

    if (query.accountStatus) {
        const accountStatus = query.accountStatus as string[];
        filterQuery.accountStatus = { $in: accountStatus };
    }

    try {
        const users = await getFilteredUsers(filterQuery);
        return res.status(200).send(users);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
};

export const updateUserStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const accountStatus = req.body.accountStatus;
    try {
        if (!userId || !accountStatus) {
            const error: ErrorResponse = {
                statusCode: 400,
                message: "Missing data",
                name: "MissingDataError"
            }
            throw error;
        }

        if (accountStatus === undefined) {
            const error: ErrorResponse = {
                statusCode: 400,
                message: "Account status is required",
                name: "MissingDataError"
            }
            throw error;
        }

        const user = await findUserAndUpdate({ _id: userId }, { $set: { status: accountStatus } });
        await createNotification({
            user: userId,
            title: "Account Status Updated",
            message: `Your account status has been updated to ${accountStatus}`,
            type: NotificationType.ACTIVITY
        });

        
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // set account activation notification to inactive
        await updateNotification({ user: userId, title: "Complete Your Profile"},
            { isActive: false } 
        );

        return res.status(200).send({ message: "User status updated successfully" });
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }

}
