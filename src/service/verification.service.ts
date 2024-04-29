
import verificationModel, { VerificationDocument } from "../model/verification.model";
import { ObtainDocumentType } from "mongoose";

export const saveOTP = async (data:ObtainDocumentType<Omit<VerificationDocument, 'createdAt' | 'updatedAt'>>) => {
    try {   
        const otpDoc = await verificationModel.create(data);
        return otpDoc;
    } catch (err: any) {
        throw new Error(err);
    }
}

export const validateOTP = async (target: string, code: string) => {
    try {
        
        const otpDoc = await verificationModel.findOne({ target, code, expiresAt: { $gt: new Date() } });
       
        if (!otpDoc) {
            return false;
        }
        return true;
    } catch (err: any) {
        throw new Error(err);
    }
}