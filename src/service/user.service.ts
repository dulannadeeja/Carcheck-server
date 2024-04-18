import { FilterQuery, ObtainDocumentType, UpdateQuery } from 'mongoose';
import UserModel, { UserDocument } from '../model/user.model';
import { omit } from 'lodash';

export async function createUser(input: ObtainDocumentType<Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword' | 'userDocs'>>) {
    try {
        return await UserModel.create(input);
    }
    catch (err: any) {
        throw new Error(err)
    }
}

export async function validatePassword(emailOrUsername: string, password: string) {
    const user: UserDocument | null = await UserModel.findOne({ email: emailOrUsername });
    if (!user) {
        return false;
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
        return false;
    }
    return omit(user.toJSON(), 'password');
}

export async function findUser(query: FilterQuery<UserDocument>) {
    return UserModel.findOne(query).lean();
}

export async function findUserAndUpdate(
    query: FilterQuery<UserDocument>,
    update: UpdateQuery<Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>>
): Promise<ObtainDocumentType<Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>> | null> {
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            query,
            { ...update },
            { new: true, safe: true, upsert: false }
        ).exec();
        return updatedUser?.toJSON() ?? null;
    } catch (err:any) {
        throw new Error(err);
    }
}