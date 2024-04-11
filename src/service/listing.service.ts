export const createVehicleListing = async (input: ObtainDocumentType<Omit<VehicleListingDocument, 'createdAt' | 'updatedAt'>>) => {
    try {
        return await VehicleListingModel.create(input);
    } catch (err: any) {
        throw new Error(err);
    }
}