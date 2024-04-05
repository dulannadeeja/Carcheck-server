import { get } from "lodash";
import SessionModel, { SessionDocument } from "../model/session.model";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import { findUser } from "./user.service";

export async function createSession(userId: string, userAgent: string) {
    const session = await SessionModel.create({ user: userId, userAgent });
    return session.toJSON();
}

export async function reIssueAccessToken(refreshToken: string) {
    const { decoded } = verifyJwt(refreshToken);

    if (!decoded || !get(decoded, "session")) return false;

    const session = await SessionModel.findById(get(decoded, "session"));

    if (!session || !session.valid) return false;

    const user = await findUser({ _id: session.user });

    if (!user) return false;

    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: process.env.ACCESS_TOKEN_TIME_TO_LIVE as string}
    );

    return accessToken;
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
    return SessionModel.find(query).lean();
}

export async function updateSession(
    query: FilterQuery<SessionDocument>,
    update: UpdateQuery<SessionDocument>
) {
    return SessionModel.updateOne(query, update);
}