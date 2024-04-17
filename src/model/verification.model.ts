import mongoose, { Schema } from "mongoose";

export enum VerificationType {
    email = "email",
    phone = "phone"
}

const verificationSchema = new Schema({
    code: { type: String, required: true },
    target: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const verificationModel = mongoose.model('Verification', verificationSchema);

export interface VerificationDocument extends mongoose.Document {
    code: string;
    target: string;
    expiresAt: Date;
    user: string;
}

export default verificationModel;