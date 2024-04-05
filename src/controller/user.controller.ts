import { Request, Response } from "express";
import logger from "../utils/logger";
import { createUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash"
import userModel from "../model/user.model";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput["body"]>, res: Response) {
    try {
        // check if the user with the same email already exists
        // if so, return a 409 error
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).send("User with same email already exists");
        }
        const user = await createUser(req.body);
        return res.status(201).send(omit(user.toJSON(), "password"));
    }
    catch (err: any) {
        logger.error(err);
        res.status(409).send(err.message);
    }
}