import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { typeOfOwnerships } from '../types';
const Schema = mongoose.Schema;

export enum AccountType {
    buyerPersonal = 'buyer-personal',
    buyerBusiness = 'buyer-business',
    sellerPersonal = 'seller-personal',
    sellerBusiness = 'seller-business',
    admin = 'admin',
    servicePoint = 'service-point'
}

export enum BusinessType {
    SpareParts = "Spare-parts",
    AutomotiveService = "Automotive-service",
    VehicleDealership = "Vehicle-dealership",
}

export interface UserDocument extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar: string;
    isVerified: boolean;
    accountType: AccountType;
    mobile: string;
    businessName: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const addressSchema = new Schema({
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    zip: { type: String, required: false },
}, { _id: false });

const personalInfoSchema = new Schema({
    drivingLicense: { type: String, required: false },
    nationalId: { type: String, required: false },
    passportNo: { type: String, required: false }
})

const businessInfoSchema = new Schema({
    businessName: { type: String, required: true },
    businessReqNo: { type: String, required: true },
    businessWebsite: { type: String, required: false},
    ownershipType: { type: String, enum: Object.values(typeOfOwnerships), required: true }
})

const financialInfoSchema = new Schema({
    bankName: { type: String, required: true },
    accountNumber: { type: Number, required: true },
    accountName: { type: String, required: true },
    branchCode: { type: String, required: true },
})

const userSchema = new Schema({
    accountType: { type: String, enum: Object.values(AccountType), default: AccountType.buyerPersonal },
    phone: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    businessAddress: { type: addressSchema },
    personalInfo: { type: personalInfoSchema },
    businessInfo: { type: businessInfoSchema },
    financialInfo: { type: financialInfoSchema },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
userSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS as string));
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error: any) {
        next(error);
    }
});

// Compare password with hashed password
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

const userModel = mongoose.model('User', userSchema);

export default userModel;