import { NextFunction, Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import { sendErrorToErrorHandlingMiddleware } from "../utils/errorHandling";


export const createUserSessionHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // validate the email and password
        const user = await validatePassword(req.body.email, req.body.password);
        if (!user) {
            return res.status(401).send("Invalid username or password.");
        }

        // create a session
        const session = await createSession(user._id, req.get('user-agent') || "");

        // create access token
        const accessToken = signJwt({ ...user, session: session._id }, { expiresIn: process.env.ACCESS_TOKEN_TIME_TO_LIVE as string });

        // create refresh token
        const refreshToken = signJwt({ ...user, session: session._id }, { expiresIn: process.env.REFRESH_TOKEN_TIME_TO_LIVE as string });

        // send back the access and refresh token
        return res.status(201).send({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
                isVerified: user.isVerified,
                accountType: user.accountType,
                mobile: user.mobile,
                businessName: user.businessName,
                businessType: user.businessType,
                accessToken,
                refreshToken,
            }
        });
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}


export const getUserSessionsHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user._id;

    try {
        const sessions = await findSessions({ user: userId, valid: true });
        return res.send(sessions);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}


export async function deleteSessionHandler(req: Request, res: Response, next: NextFunction) {
    const sessionId = res.locals.user.session;

    try {
        await updateSession({ _id: sessionId }, { valid: false });
        return res.status(200).send(
            {
                message: "Session deleted successfully"
            }
        );
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);

    }
}