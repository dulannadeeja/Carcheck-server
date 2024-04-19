import { NextFunction, Request, Response } from "express";
import { createUser, findUser, findUserAndUpdate, getFilteredUsers } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash"
import userModel, { UserDocs, UserDocument } from "../model/user.model";
import { AccountType, ErrorResponse } from "../types";
import { sendErrorToErrorHandlingMiddleware } from "../utils/errorHandling";
import { sendOTP, sendVerificationEmail } from "../service/notification.service";
import { saveOTP, validateOTP } from "../service/verification.service";
import { ObtainDocumentType } from "mongoose";
import { VerificationDocument, VerificationType } from "../model/verification.model";
import { add } from "date-fns";
import _ = require("lodash");

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

export const sendPhoneOTPHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;

        // genarate a random 6 digit OTP
        // const otp = Math.floor(100000 + Math.random() * 900000)
        const otp = 123456; // this is a static OTP for testing purposes, since we have limited access to AWS SNS
        const otpString = otp.toString();

        let target = req.body.target;

        if (req.body.type === VerificationType.phone) {
            target = `+94${req.body.target}`;
            await sendOTP(target, otpString);
        } else {
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

        const user = await findUserAndUpdate({ _id: userId }, { $set: { status:accountStatus } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        console.log(user);
        return res.status(200).send({ message: "User status updated successfully" });
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }

}
