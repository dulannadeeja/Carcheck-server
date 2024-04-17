import { ObtainDocumentType } from "mongoose";
import inspectionModel, { InspectionDocument } from "../model/inspection.model";

export const createInspectionSchedule = async (input: ObtainDocumentType<Omit<InspectionDocument, 'createdAt' | 'updatedAt'>>) => {
    try {
        return await inspectionModel.create(input);
    }
    catch (err: any) {
        throw new Error(err);
    }
}