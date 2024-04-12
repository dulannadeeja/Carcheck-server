export interface ErrorResponse extends Error {
    statusCode: number;
    message: string;
    fieldErrors?: FieldError[];
}

export type FieldError = {
    field: string;
    message: string;
}

// accountType enum
export enum AccountType {
    buyerPersonal = 'buyer-personal',
    buyerBusiness = 'buyer-business',
    sellerPersonal = 'seller-personal',
    sellerBusiness = 'seller-business',
    admin = 'admin',
    servicePoint = 'service-point'
}

// businessType enum
export enum BusinessType {
    SpareParts = "Spare-parts",
    AutomotiveService = "Automotive-service",
    VehicleDealership = "Vehicle-dealership",
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



