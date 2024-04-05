import mongoose from 'mongoose';
import { UserDocument } from './user.model';

const Schema = mongoose.Schema;

export interface SessionDocument extends mongoose.Document {
    user: UserDocument['_id'];
    valid: boolean;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' , required: true},
    valid: { type: Boolean, default: true },
    userAgent: { type: String }
}, { timestamps: true });

const sessionModel = mongoose.model('Session', sessionSchema);

export default sessionModel;