import { Request, Response } from "express";
import logger from "../utils/logger";
import { createUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash"
import userModel from "../model/user.model";
import { ErrorResponse } from "../types";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput["body"]>, res: Response, next: Function) {
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
        logger.error(err);
        const error: ErrorResponse = {
            statusCode: err.statusCode || 500,
            message: err.message,
            name: err.name
        }
        next(error);
    }
}