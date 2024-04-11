import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
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

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    accountType: { type: String, enum: Object.values(AccountType), default: AccountType.buyerPersonal },
    mobile: { type: String, required: false },
    businessName: { type: String, required: false },
    businessType: { type: String, enum: Object.values(BusinessType), required: false },
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