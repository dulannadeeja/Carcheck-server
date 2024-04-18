export interface ErrorResponse extends Error {
    statusCode: number;
    message: string;
    fieldErrors?: FieldError[];
}

export type FieldError = {
    field: string;
    message: string;
}

export enum IdentityVerificationDocType {
    nationalId = "national-id",
    passport = "passport",
    drivingLicense = "driving-license",
}

export enum BusinessVerificationDocType {
    businessRegistration = "business-registration",
    bankDocument = "bank-document",
}

// accountType enum
export enum AccountType {
    buyerPersonal = 'buyer-personal',
    buyerBusiness = 'buyer-business',
    sellerPersonal = 'seller-personal',
    sellerBusiness = 'seller-business',
    serviceProvider = 'service-provider',
    admin = 'admin'
}

// businessType enum
export enum BusinessType {
    SpareParts = "Spare-parts",
    AutomotiveService = "Automotive-service",
    VehicleDealership = "Vehicle-dealership",
    VehicleSeller = "Vehicle-seller",
}

// types of ownership of sri lankan businesses
export enum typeOfOwnerships {
    Partnership = "Partnership",
    SoleProprietorship = "Sole-proprietorship",
    Corporation = "Corporation",
    nonProfit = "Non-profit",
    Cooperative = "Cooperative",
    limitedCompany = "Limited-company",
    soleTrader = "Sole-traders",
    merger = "Merger",
    unlimitedLiability = "Unlimited-liability",
}

export interface User {
    email: string;
    password: string;
    accountType: AccountType;
}

export interface BuyerPersonal extends User {
    accountType: AccountType.buyerPersonal
    firstName: string;
    lastName: string;
}

export interface BuyerBusiness extends User {
    accountType: AccountType.buyerBusiness
    businessName: string;
    buinessType: BusinessType;
}

