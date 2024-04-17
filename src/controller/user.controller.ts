import { NextFunction, Request, Response } from "express";
import { createUser, findUser, findUserAndUpdate } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash"
import userModel, { UserDocument } from "../model/user.model";
import { ErrorResponse } from "../types";
import { sendErrorToErrorHandlingMiddleware } from "../utils/errorHandling";
import { sendOTP, sendVerificationEmail } from "../service/notification.service";
import { saveOTP, validateOTP } from "../service/verification.service";
import { ObtainDocumentType } from "mongoose";
import { VerificationDocument, VerificationType } from "../model/verification.model";
import { add } from "date-fns";

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
        // find the user with the given id
        const user = await findUser({ _id: userId });
        if (!user) {
            const error: ErrorResponse = {
                statusCode: 404,
                message: "User not found",
                name: "UserNotFoundError"
            }
            throw error;
        }
        // ready input for creating a seller
        const input: ObtainDocumentType<Omit<UserDocument,
            'createdAt' | 'updatedAt' | 'comparePassword' | 'password' | 'avatar'>> = {
            ...user,
            ...req.body,
            firstName: req.body.personalInfo.firstName,
            lastName: req.body.personalInfo.lastName,
        }
        const seller = await findUserAndUpdate(input);
        const outputSeller = omit(seller?.toJSON(), 'password');
        return res.status(201).send(outputSeller);
    } catch (err: any) {
        const error = {
            statusCode: err.statusCode || 500,
            message: err.message,
            name: err.name
        }
        next(error);
    }
}