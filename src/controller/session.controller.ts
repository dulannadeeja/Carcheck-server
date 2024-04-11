import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";


export const createUserSessionHandler = async (req: Request, res: Response) => {

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
}


export const getUserSessionsHandler = async (req: Request, res: Response) => {
    const userId = res.locals.user._id;

    const sessions = await findSessions({ user: userId, valid: true });

    return res.send(sessions);
}


export async function deleteSessionHandler(req: Request, res: Response) {
    const sessionId = res.locals.user.session;

    await updateSession({ _id: sessionId }, { valid: false });

    return res.send({
        accessToken: null,
        refreshToken: null,
    });
}