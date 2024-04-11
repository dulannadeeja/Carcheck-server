import mongoose, { Schema } from "mongoose";

export enum VehicleMake {
    toyota = "Toyota",
    suzuki = "Suzuki",
    nissan = "Nissan",
    honda = "Honda",
    mitsubishi = "Mitsubishi",
    mercedesBenz = "Mercedes Benz",
    landRover = "Land Rover",
    audi = "Audi",
    micro = "Micro",
    kia = "Kia",
    hyundai = "Hyundai",
    mahindra = "Mahindra",
    daihatsu = "Daihatsu",
    mazda = "Mazda",
    marutiSuzuki = "Maruti Suzuki",
    peugeot = "Peugeot",
    tata = "Tata",
    dfsk = "DFSK",
    ford = "Ford",
    mg = "MG",
    volkswagen = "Volkswagen",
    perodua = "Perodua",
    renault = "Renault",
    isuzu = "Isuzu",
    ssangYong = "Ssang Yong",
    chevrolet = "Chevrolet",
    porsche = "Porsche",
    proton = "Proton",
    morris = "Morris",
    zotye = "Zotye",
    datsun = "Datsun",
    daewoo = "Daewoo",
    jeep = "Jeep",
    fiat = "Fiat",
    austin = "Austin",
    lexus = "Lexus",
    tesla = "Tesla",
    volvo = "Volvo",
    chery = "Chery",
    alfaRomeo = "Alfa Romeo",
    bmw = "BMW",
    jaguar = "Jaguar",
    subaru = "Subaru",
    hummer = "Hummer",
    cadillac = "Cadillac",
    astonMartin = "Aston Martin",
    bentley = "Bentley",
    otherBrand = "Other Brand",
    otherLuxuryBrand = "Other Luxury Brand",

}

export enum VehicleCategory {
    suv = "SUV",
    sedan = "Sedan",
    coupe = "Coupe",
    convertible = "Convertible",
    hatchback = "Hatchback",
    pickup = "Pickup",
    van = "Van",
    miniVan = "Mini Van",
    mpv = "MPV",
    crossover = "Crossover",
    truck = "Truck",
    bus = "Bus",
    miniBus = "Mini Bus",
    wagon = "Wagon",
    otherCategory = "Other Category"
}

export const vehicleMakeArray = Object.values(VehicleMake);
export const vehicleCategoryArray = Object.values(VehicleCategory);

export interface VehicleDocument {
    make: string;
    vehicleModel: string;
    category: string[];
}

const vehicleSchema = new Schema({
    make: { type: String },
    vehicleModel: { type: String },
    category: { type: Array },
}, { timestamps: true });

const VehicleModel = mongoose.model<VehicleDocument>("Vehicle", vehicleSchema);

export default VehicleModel;